<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <title>Login - ServiceMaster</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="login-page">
    <div class="login-container">
        <h1>ServiceMaster PHP</h1>
        <form action="index.php?action=auth" method="POST">
            <div class="form-group">
                <label>Email</label>
                <input type="email" name="email" required>
            </div>
            <div class="form-group">
                <label>Contrasenya</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit" class="btn-primary">Entrar</button>
        </form>
    </div>
</body>
</html>