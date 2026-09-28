---
"@gestionresidencial/shared-ui": patch
---

GR-168: validaciones de formato alineadas con el backend. `PasswordField` limita a 72 caracteres y acepta `policy` y `hint` (politica de 8-72 con minuscula, mayuscula y digito), usada por `ChangePasswordForm` con la etiqueta opcional `passwordPolicy`. `LoginForm` valida el formato del correo y `ProfileForm` el nombre y el celular colombiano (`3xxxxxxxxx` o fijo `60xxxxxxxx`). Se exportan los patrones `PERSON_NAME_PATTERN`, `EMAIL_PATTERN`, `PHONE_PATTERN`, `DOCUMENT_PATTERN`, `UNIT_CODE_PATTERN` y `PASSWORD_POLICY_PATTERN`.
