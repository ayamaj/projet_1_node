import { useState, useEffect } from 'react';

export default function Counter() {

  const [count, setCount] = useState(() => {
    const sauvegarde = localStorage.getItem('mon_compteur_valeur');
    return sauvegarde !== null ? parseInt(sauvegarde, 10) : 0;
  });

  const [step, setStep] = useState(1);
  const [message, setMessage] = useState('Aucun clic pour le moment');
  const [totalClics, setTotalClics] = useState(0);

  const [historique, setHistorique] = useState(() => {
    const sauvegarde = localStorage.getItem('mon_compteur_historique');
    return sauvegarde !== null ? JSON.parse(sauvegarde) : [];
  });

  // Gestionnaire d'incrementation
  const handleIncrement = () => {
    const nouveauCompte = count + step;

    if (nouveauCompte > 50) {
      alert("Seuil maximal de 50 atteint !");
      return;
    }

    setCount(nouveauCompte);
    setMessage('Ajout de ' + step);
    setTotalClics(totalClics + 1);

    const action = '+' + step;
    setHistorique([...historique, action]);
  };

  // Gestionnaire de decrementation
  const handleDecrement = () => {
    const nouveauCompte = count - step;

    if (nouveauCompte < -50) {
      alert("Seuil minimal de -50 atteint !");
      return;
    }

    setCount(nouveauCompte);
    setMessage('Retrait de ' + step);
    setTotalClics(totalClics + 1);

    const action = '-' + step;
    setHistorique([...historique, action]);
  };

  // Gestionnaire de remise a zero
  const handleReset = () => {
    setCount(0);
    setMessage('Remise a zero');
    setTotalClics(totalClics + 1);
    setHistorique([]);
  };

  // Couleur dynamique selon le signe du compteur
  const getStyleClass = () => {
    if (count > 0) return 'counter-display positive';
    if (count < 0) return 'counter-display negative';
    return 'counter-display zero';
  };

  // EFFET A : Synchroniser le titre de l'onglet
  useEffect(() => {
    document.title = 'Compteur : ' + count;
  }, [count]);

  // EFFET B : Sauvegarde automatique de count
  useEffect(() => {
    localStorage.setItem('mon_compteur_valeur', count.toString());
  }, [count]);

  // Sauvegarde automatique de l'historique
  useEffect(() => {
    localStorage.setItem(
      'mon_compteur_historique',
      JSON.stringify(historique)
    );
  }, [historique]);

  // Controle du compteur au clavier
  useEffect(() => {

    const handleKeyDown = (e) => {

      if (e.key === 'ArrowUp') {
        handleIncrement();
      }

      if (e.key === 'ArrowDown') {
        handleDecrement();
      }

    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };

  }, [count, step, historique, totalClics]);

  return (
    <div className="counter-card">

      <div className={getStyleClass()}>
        {count}
      </div>

      <div className="btn-group">

        <button
          className="btn btn-dec"
          onClick={handleDecrement}
        >
          -{step}
        </button>

        <button
          className="btn btn-reset"
          onClick={handleReset}
        >
          Reset
        </button>

        <button
          className="btn btn-inc"
          onClick={handleIncrement}
        >
          +{step}
        </button>

      </div>

      <div className="step-control">

        <label>Pas d'incrementation :</label>

        <select
          value={step}
          onChange={(e) => setStep(parseInt(e.target.value, 10))}
        >
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="5">5</option>
          <option value="10">10</option>
        </select>

      </div>

      <div className="history-card">

        <p>
          <strong>Derniere action :</strong> {message}
        </p>

        <p>
          <strong>Total des clics :</strong> {totalClics}
        </p>

        {historique.length > 0 && (
          <p>
            <strong>Historique :</strong> {historique.join(', ')}
          </p>
        )}

      </div>

    </div>
  );
}