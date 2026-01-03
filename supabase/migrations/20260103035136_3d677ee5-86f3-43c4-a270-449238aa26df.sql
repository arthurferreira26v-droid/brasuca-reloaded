-- 1) Add ownership columns for user isolation
ALTER TABLE public.championships
ADD COLUMN IF NOT EXISTS user_id uuid;

ALTER TABLE public.team_budgets
ADD COLUMN IF NOT EXISTS user_id uuid;

-- Backfill existing rows to NULL ownership (legacy data). New rows will require auth.

-- 2) Drop overly-permissive public write policies
DROP POLICY IF EXISTS "Permitir acesso público a campeonatos" ON public.championships;
DROP POLICY IF EXISTS "Permitir acesso público a partidas" ON public.matches;
DROP POLICY IF EXISTS "Permitir acesso público a classificação" ON public.standings;
DROP POLICY IF EXISTS "Permitir acesso público a budgets" ON public.team_budgets;

-- 3) Ensure RLS is enabled (idempotent)
ALTER TABLE public.championships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_budgets ENABLE ROW LEVEL SECURITY;

-- 4) Ownership-based policies (default-deny; authenticated only)

-- championships
CREATE POLICY "championships_select_own"
ON public.championships
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "championships_insert_own"
ON public.championships
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "championships_update_own"
ON public.championships
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "championships_delete_own"
ON public.championships
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- matches (access via championship ownership)
CREATE POLICY "matches_select_own"
ON public.matches
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.championships c
    WHERE c.id = championship_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY "matches_insert_own"
ON public.matches
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.championships c
    WHERE c.id = championship_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY "matches_update_own"
ON public.matches
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.championships c
    WHERE c.id = championship_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY "matches_delete_own"
ON public.matches
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.championships c
    WHERE c.id = championship_id
      AND c.user_id = auth.uid()
  )
);

-- standings (access via championship ownership)
CREATE POLICY "standings_select_own"
ON public.standings
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.championships c
    WHERE c.id = championship_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY "standings_insert_own"
ON public.standings
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.championships c
    WHERE c.id = championship_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY "standings_update_own"
ON public.standings
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.championships c
    WHERE c.id = championship_id
      AND c.user_id = auth.uid()
  )
);

CREATE POLICY "standings_delete_own"
ON public.standings
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.championships c
    WHERE c.id = championship_id
      AND c.user_id = auth.uid()
  )
);

-- team_budgets
CREATE POLICY "team_budgets_select_own"
ON public.team_budgets
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "team_budgets_insert_own"
ON public.team_budgets
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "team_budgets_update_own"
ON public.team_budgets
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "team_budgets_delete_own"
ON public.team_budgets
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- 5) Require ownership for new writes (enforced by RLS; optional DB constraint could be added later)
