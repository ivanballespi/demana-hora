<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestió de Serveis | demana-hora</title>
    <link rel="stylesheet" href="css/estil.css">
</head>
<body>
    <div class="dashboard-wrapper">
        <!-- sidebar -->
        <aside class="sidebar">
            <h2>demana-hora</h2>
            <ul class="nav-links">
                <li><a href="index.php?action=dashboard">Inici / Cites</a></li>
                <li><a href="index.php?action=gestio_serveis" class="active">Gestionar Serveis</a></li>
            </ul>
            <div style="margin-top: auto;">
                <a href="index.php?action=logout" class="logout-link">Tancar sessió</a>
            </div>
        </aside>

        <!-- Contingut Principal -->
        <main class="main-content">
            <header class="top-bar">
                <h1>Configuració de Serveis</h1>
                <div class="user-badge">ADMINISTRADOR</div>
            </header>

            <!-- Formulari per Afegir -->
            <section class="card">
                <h3>Afegir nou servei</h3>
                <form action="index.php?action=crear_servei" method="POST" style="display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 15px; align-items: end; margin-top: 15px;">
                    <div class="form-group">
                        <label>Nom del Servei</label>
                        <input type="text" name="nom" placeholder="Ex: Tall de cabells" required>
                    </div>
                    <div class="form-group">
                        <label>Preu (€)</label>
                        <input type="number" step="0.01" name="preu" placeholder="15.00" required>
                    </div>
                    <div class="form-group">
                        <label>Durada (min)</label>
                        <input type="number" name="durada" placeholder="30" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                    
                    <div class="form-group" style="grid-column: span 4;">
                        <label>Descripció (opcional)</label>
                        <input type="text" name="descripcio" placeholder="Breu descripció del servei...">
                    </div>
                </form>
            </section>

            <!-- Llista de Serveis Existents -->
            <section class="card">
                <h3>Serveis Actius</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Servei</th>
                            <th>Descripció</th>
                            <th>Preu</th>
                            <th>Durada</th>
                            <th>Accions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($serveis)): ?>
                            <tr>
                                <td colspan="5" style="text-align: center; padding: 20px;">No hi ha serveis creats encara.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($serveis as $s): ?>
                                <tr>
                                    <td><strong><?php echo htmlspecialchars($s['nom']); ?></strong></td>
                                    <td><?php echo htmlspecialchars($s['descripcio']); ?></td>
                                    <td><?php echo $s['preu']; ?> €</td>
                                    <td><?php echo $s['durada']; ?> min</td>
                                    <td>
                                        <a href="index.php?action=eliminar_servei&id=<?php echo $s['id']; ?>" 
                                           class="btn btn-danger" 
                                           style="padding: 5px 10px; font-size: 0.8rem;"
                                           onclick="return confirm('Segur que vols eliminar aquest servei?')">
                                           Eliminar
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </tbody>
                </table>
            </section>
        </main>
    </div>
</body>
</html>