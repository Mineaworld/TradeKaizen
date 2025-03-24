-- Function to get column information
CREATE OR REPLACE FUNCTION public.get_columns_info(table_name text)
RETURNS TABLE(column_name text, data_type text, is_nullable boolean, column_default text) 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.column_name::text,
    c.data_type::text,
    (c.is_nullable = 'YES')::boolean,
    c.column_default::text
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' 
    AND c.table_name = get_columns_info.table_name
  ORDER BY 
    c.ordinal_position;
END;
$$;

-- Function to get foreign key information
CREATE OR REPLACE FUNCTION public.get_foreign_keys(table_name text)
RETURNS TABLE(column_name text, foreign_table text, foreign_column text) 
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    kcu.column_name::text,
    ccu.table_name::text AS foreign_table,
    ccu.column_name::text AS foreign_column
  FROM
    information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
  WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
    AND tc.table_name = get_foreign_keys.table_name;
END;
$$;
