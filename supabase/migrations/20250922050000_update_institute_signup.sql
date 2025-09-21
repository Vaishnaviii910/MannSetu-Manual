CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  -- Create a profile for the new user
  insert into public.profiles (user_id, email, role)
  values (new.id, new.email, new.raw_user_meta_data->>'role');
  
  -- If the user is a student, create a student record
  if new.raw_user_meta_data->>'role' = 'student' then
    insert into public.students (user_id, full_name, institute_id, student_id)
    values (new.id, new.raw_user_meta_data->>'fullName', (new.raw_user_meta_data->>'instituteId')::uuid, new.raw_user_meta_data->>'studentId');
  
  -- If the user is an institute, create an institute record
  elsif new.raw_user_meta_data->>'role' = 'institute' then
    insert into public.institutes (user_id, institute_name, address, phone, website, description, verification_document_url)
    values (
      new.id, 
      new.raw_user_meta_data->>'instituteName', 
      new.raw_user_meta_data->>'address', 
      new.raw_user_meta_data->>'phone', 
      new.raw_user_meta_data->>'website', 
      new.raw_user_meta_data->>'description',
      -- This is the new line that saves the URL
      new.raw_user_meta_data->>'verification_document_url'
    );
  end if;
  
  return new;
end;
$function$
;