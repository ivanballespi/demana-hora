<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>demana-hora | Inicia sessió</title>
    <link rel="stylesheet" href="css/estil.css">
</head>
<body class="auth-page">
    <div class="auth-card">
        <h1>demana-hora</h1>
        <p class="subtitle" style="text-align: center; color: #64748b; margin-bottom: 2rem;">Benvingut de nou</p>

        <!-- Missatge d'èxit després del registre -->
        <?php if(isset($_GET['success']) && $_GET['success'] == 'registre_ok'): ?>
            <div class="alert alert-success">
                Compte creat correctament! Ja pots entrar.
            </div>
        <?php endif; ?>

        <!-- Missatge d'error de login -->
        <?php if(isset($_GET['error']) && $_GET['error'] == 'login_incorrecte'): ?>
            <div class="alert alert-error">
                Email o contrasenya incorrectes.
            </div>
        <?php endif; ?>

        <form action="index.php?action=do_login" method="POST">
            <div class="form-group">
                <label for="email">Correu Electrònic</label>
                <input type="email" id="email" name="email" placeholder="hola@exemple.cat" required>
            </div>
            
            <div class="form-group">
                <label for="password">Contrasenya</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Entrar al sistema</button>
        </form>
        
        <p class="footer-link" style="text-align: center; margin-top: 1.5rem;">
            Encara no tens compte? <a href="index.php?action=register">Registra't aquí</a>
        </p>
    </div>
</body>
</html>