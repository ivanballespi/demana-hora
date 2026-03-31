<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard | demana-hora</title>
    <link rel="stylesheet" href="css/estil.css"> 
</head>
<body>
    <div class="dashboard-wrapper">
        
        <!-- sidebar lateral -->
        <aside class="sidebar">
            <h2>demana-hora</h2>
            <ul class="nav-links">
                <li><a href="index.php?action=dashboard" class="active">Inici / Cites</a></li>
                <?php if ($_SESSION['user_rol'] === 'admin'): ?>
                    <li><a href="index.php?action=gestio_serveis">Gestionar Serveis</a></li>
                <?php endif; ?>
            </ul>
            <div style="margin-top: auto;">
                <a href="index.php?action=logout" class="logout-link">Tancar sessió</a>
            </div>
        </aside>

        <!-- contingut Principal -->
        <main class="main-content">
            <header class="top-bar">
                <h1>Benvingut, <?php echo htmlspecialchars($_SESSION['user_nom']); ?>!</h1>
                <div class="user-badge"><?php echo strtoupper($_SESSION['user_rol']); ?></div>
            </header>

            <!-- targeta de dades -->
            <section class="card">
                <h3>Les teves properes cites</h3>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Servei</th>
                            <th>Data i Hora</th>
                            <th>Estat</th>
                            <th>Accions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php if (empty($cites)): ?>
                            <tr>
                                <td colspan="4" style="text-align: center; padding: 2rem;">No tens cap cita programada.</td>
                            </tr>
                        <?php else: ?>
                            <?php foreach ($cites as $cita): ?>
                                <tr>
                                    <td><?php echo htmlspecialchars($cita['servei_nom']); ?></td>
                                    <td><?php echo date('d/m/Y H:i', strtotime($cita['data_cita'])); ?>h</td>
                                    <td>
                                        <span class="status-pill status-<?php echo $cita['estat']; ?>">
                                            <?php echo ucfirst($cita['estat']); ?>
                                        </span>
                                    </td>
                                    <td>
                                        <a href="index.php?action=cancelar&id=<?php echo $cita['id']; ?>" class="btn btn-danger" style="padding: 0.3rem 0.6rem; font-size: 0.8rem;">Cancel·lar</a>
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