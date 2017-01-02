create function get_accounts_of_type(account_type varchar)
  returns setof accounts as $$
  begin
    return query
    with recursive accounts_of_type(code) as (
      select a.*
        from accounts as a
       where a.type = account_type
       union all
      select a.*
        from accounts as a, accounts_of_type as aot
       where a.parent_code = aot.code
    )
    select *
      from accounts_of_type as aot
     order by aot.code;
  end;
$$ language plpgsql;
