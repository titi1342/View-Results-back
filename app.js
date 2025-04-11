const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json()); // pour parser les requêtes POST en JSON

const PORT = 5000;

// 🔐 Mot de passe hashé (pour "supersecret123")
const hashedPassword = "$2b$10$osgV6FzW2JQxhrAEPpszIusbBI7xVBb74cDfztRyMb3zCA9Q7HP1i";
const hashedUsername = "$2b$10$CwTC8/5uXXnxgUxMoRLAf.p6a8A1oebefO0GTSS9LLbSduhBAC9J2";

// ✅ Route de vérification du mot de passe
app.post('/check-password', async (req, res) => {
  const { user, password } = req.body;
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    const isUserMatch = await bcrypt.compare(user, hashedUsername);
    if (isMatch && isUserMatch) {
      res.json({ success: true });

      // Connexion MongoDB
      const dbURI = "mongodb://rdenadmin:uVgNBLkoXIYvauV@57.129.18.234:27017/redditdatascrapeen?authSource=redditdatascrapeen";
      mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('✅ Connexion réussie à MongoDB');
      })
      .catch((err) => {
        console.error('❌ Erreur de connexion à MongoDB :', err);
      });

    // Modèles Mongo
    const EducationResult = mongoose.model('education_results', new mongoose.Schema({}, { strict: false }));
    const HealthResult = mongoose.model('health_results', new mongoose.Schema({}, { strict: false }));
    const HealthResultLlama = mongoose.model('health_results_llama', new mongoose.Schema({}, { strict: false }));
    const KidsResult = mongoose.model('kids_results', new mongoose.Schema({}, { strict: false }));
    const KidsResultLlama = mongoose.model('kids_results_llama', new mongoose.Schema({}, { strict: false }));

    // Routes API
    app.get('/education-results', async (req, res) => {
      try {
        const results = await EducationResult.find().limit(10);
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: 'Erreur de récupération' });
      }
    });

    app.get('/health-results', async (req, res) => {
      try {
        const results = await HealthResult.find().limit(10);
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: 'Erreur de récupération' });
      }
    });

    app.get('/health-results-llama', async (req, res) => {
      try {
        const results = await HealthResultLlama.find().limit(10);
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: 'Erreur de récupération' });
      }
    });

    app.get('/kids-results', async (req, res) => {
      try {
        const results = await KidsResult.find().limit(10);
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: 'Erreur de récupération' });
      }
    });

    app.get('/kids-results-llama', async (req, res) => {
      try {
        const results = await KidsResultLlama.find().limit(10);
        res.json(results);
      } catch (err) {
        res.status(500).json({ error: 'Erreur de récupération' });
      }
    });

    } else {
      res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
});