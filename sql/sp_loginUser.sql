CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_loginUser`(
    IN p_username VARCHAR(300),
    IN p_password VARCHAR(300)
)
BEGIN
    if ( select exists (select user_username from tbl_user where user_username = p_username AND user_password = p_password) ) THEN
     
        select user_id, user_username from tbl_user where user_username = p_username;
     
    ELSE
     
        select 'Invalid username or password !';
     
    END IF;
END