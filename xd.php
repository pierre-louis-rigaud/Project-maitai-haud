<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Station Météo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        header {
            background: #4CAF50;
            color: white;
            text-align: center;
            padding: 1em 0;
        }
        table {
            width: 80%;
            margin: 20px auto;
            border-collapse: collapse;
        }
        table, th, td {
            border: 1px solid black;
        }
        th, td {
            padding: 10px;
            text-align: center;
        }
        th {
            background: #f2f2f2;
        }
        .chart-container {
            width: 80%;
            margin: 20px auto;
        }
    </style>
</head>
<body>
    <header>
        <h1>Station Météo - Données en direct</h1>
    </header>

    <section>
        <h2 style="text-align: center;">Données Météo</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Numéro Sonde</th>
                    <th>Température (°C)</th>
                    <th>Humidité (%)</th>
                    <th>Pression (hPa)</th>
                    <th>Horodatage</th>
                </tr>
            </thead>
            <tbody>
                <?php
                // Configuration de la base de données
                $host = "localhost";
                $dbname = "meteo";
                $username = "meteo_user";
                $password = "password";

                // Connexion à la base de données
                $conn = new mysqli($host, $username, $password, $dbname);

                // Vérification de la connexion
                if ($conn->connect_error) {
                    die("Erreur de connexion : " . $conn->connect_error);
                }

                // Récupérer les données
                $sql = "SELECT * FROM mesures ORDER BY timestamp DESC LIMIT 50";
                $result = $conn->query($sql);

                if ($result->num_rows > 0) {
                    while ($row = $result->fetch_assoc()) {
                        echo "<tr>
                                <td>{$row['id']}</td>
                                <td>{$row['numero_sonde']}</td>
                                <td>{$row['temperature']}</td>
                                <td>{$row['humidite']}</td>
                                <td>{$row['pression']}</td>
                                <td>{$row['timestamp']}</td>
                              </tr>";
                    }
                } else {
                    echo "<tr><td colspan='6'>Aucune donnée disponible</td></tr>";
                }

                $conn->close();
                ?>
            </tbody>
        </table>
    </section>

    <section>
        <h2 style="text-align: center;">Graphique</h2>
        <div class="chart-container">
            <canvas id="chart"></canvas>
        </div>
    </section>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script>
        // Exemple de données (à remplacer par un chargement AJAX)
        const labels = [];
        const temperatureData = [];
        const humidityData = [];
        const pressureData = [];

        <?php
        // Recharger les données en JavaScript
        $conn = new mysqli($host, $username, $password, $dbname);
        $sql = "SELECT temperature, humidite, pression, timestamp FROM mesures ORDER BY timestamp DESC LIMIT 50";
        $result = $conn->query($sql);

        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                echo "labels.unshift('{$row['timestamp']}');\n";
                echo "temperatureData.unshift({$row['temperature']});\n";
                echo "humidityData.unshift({$row['humidite']});\n";
                echo "pressureData.unshift({$row['pression']});\n";
            }
        }
        $conn->close();
        ?>

        // Configuration du graphique
        const ctx = document.getElementById('chart').getContext('2d');
        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Température (°C)',
                        data: temperatureData,
                        borderColor: 'red',
                        fill: false
                    },
                    {
                        label: 'Humidité (%)',
                        data: humidityData,
                        borderColor: 'blue',
                        fill: false
                    },
                    {
                        label: 'Pression (hPa)',
                        data: pressureData,
                        borderColor: 'green',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: { display: true, text: 'Horodatage' }
                    },
                    y: {
                        title: { display: true, text: 'Valeurs' }
                    }
                }
            }
        });
    </script>
</body>
</html>