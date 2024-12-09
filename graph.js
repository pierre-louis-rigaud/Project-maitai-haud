// Fonction pour générer des données aléatoires
function generateRandomData(size, max) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * max));
  }
  
  // Données de base
  const labels = ['0s', '5s', '10s', '15s', '20s', '25s', '30s', '35s', '40s', '45s', '50s']; // Labels communs
  const dataSets = [
    {
      element: 'chart1',
      label: 'Température (°C)',
      data: generateRandomData(11, 40), // Valeurs pour température
      borderColor: 'rgba(255, 0, 136, 1)',
      backgroundColor: 'rgba(255, 0, 136, 0.2)',
      unit: '°C' // Unité spécifique
    },
    {
      element: 'chart2',
      label: 'Humidité (%)',
      data: generateRandomData(11, 100), // Valeurs pour vitesse du vent
      borderColor: 'rgba(17, 255, 4, 1)',
      backgroundColor: 'rgba(17, 255, 4, 0.2)',
      unit: '%' // Unité spécifique
    },
    {
      element: 'chart3',
      label: 'Pression (hPa)',
      data: generateRandomData(11, 200), // Valeurs pour précipitations
      borderColor: 'rgba(181, 9, 255, 1)',
      backgroundColor: 'rgba(181, 9, 255, 0.2)',
      unit: 'hPa' // Unité spécifique
    }
  ];
  
  // Création de graphiques pour chaque dataset
  dataSets.forEach(set => {
    const ctx = document.getElementById(set.element).getContext('2d');
    new Chart(ctx, {
      type: 'line', // Type courbe
      data: {
        labels: labels, // Labels (mois ici)
        datasets: [{
          label: set.label, // Légende avec unité
          data: set.data, // Données
          borderColor: set.borderColor, // Couleur de la ligne
          backgroundColor: set.backgroundColor, // Couleur de fond
          borderWidth: 2,
          fill: true // Remplissage sous la courbe
        }]
      },
      options: {
        responsive: true,
        plugins: {
          tooltip: {
            callbacks: {
              label: function (context) {
                // Ajout de l'unité dans l'infobulle
                return `${context.raw} ${set.unit}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: set.unit // Ajout de l'unité à l'axe Y
            }
          }
        }
      }
    });
  });
  
  // Simuler une mise à jour des données toutes les 5 secondes
  setInterval(() => {
    dataSets.forEach(set => {
      set.data = generateRandomData(11, 100); // Générer de nouvelles données
      const chart = Chart.getChart(set.element); // Récupérer le graphique
      chart.data.datasets[0].data = set.data; // Mettre à jour les données
      chart.update(); // Redessiner
    });
  }, 5000);
  
