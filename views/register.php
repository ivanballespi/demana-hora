<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>demana-hora | Registre</title>
    <link rel="stylesheet" href="css/estil.css">
</head>
<body class="auth-page">
    <div class="auth-card">
        <h1>demana-hora</h1>
        <p class="subtitle" style="text-align: center; color: #64748b; margin-bottom: 2rem;">Crea un compte nou</p>

        <?php if(isset($_GET['error'])): ?>
            <div class="alert alert-error">
                <?php 
                    if($_GET['error'] == 'email_duplicat') echo "Aquest correu ja està registrat.";
                    elseif($_GET['error'] == 'camps_buits') echo "Si us plau, omple tots els camps.";
                    else echo "Hi ha hagut un error en el registre.";
                ?>
            </div>
        <?php endif; ?>

        <form action="index.php?action=do_register" method="POST">
            <div class="form-group">
                <label for="nom">Nom Complet</label>
                <input type="text" id="nom" name="nom" placeholder="Ex: Marc Sala" required>
            </div>
            
            <div class="form-group">
                <label for="email">Correu Electrònic</label>
                <input type="email" id="email" name="email" placeholder="hola@exemple.cat" required>
            </div>
            
            <div class="form-group">
                <label for="password">Contrasenya</label>
                <input type="password" id="password" name="password" required>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;">Registrar-me</button>
        </form>
        
        <p class="footer-link" style="text-align: center; margin-top: 1.5rem;">
            Ja tens compte? <a href="index.php?action=login">Inicia sessió</a>
        </p>
    </div>
</body>
</html>