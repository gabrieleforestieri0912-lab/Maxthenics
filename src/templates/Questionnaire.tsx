/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

// src/templates/Questionnaire.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import SEO from "../components/SEO";

const API_URL = 'http://localhost:5000/api';

interface QuestionnaireFormData {
    age: string;
    experienceLevel: string;
    fitnessGoal: string;
    availableEquipment: string[];
    trainingDays: string;
}

const Questionnaire: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<QuestionnaireFormData>({
        age: '',
        experienceLevel: '',
        fitnessGoal: '',
        availableEquipment: [],
        trainingDays: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const response = await fetch(`${API_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    if (response.status === 401 || response.status === 403) return;
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setFormData({
                    age: data.age?.toString() || '',
                    experienceLevel: data.experienceLevel || '',
                    fitnessGoal: data.fitnessGoal || '',
                    availableEquipment: data.availableEquipment || [],
                    trainingDays: data.trainingDays?.toString() || '',
                });
            } catch (err) {
                console.error("Error fetching profile data:", err);
            }
        };
        fetchProfile();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            const equipment = [...formData.availableEquipment];
            if (checked) {
                equipment.push(value);
            } else {
                const index = equipment.indexOf(value);
                if (index > -1) {
                    equipment.splice(index, 1);
                }
            }
            setFormData({ ...formData, availableEquipment: equipment });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        if (!formData.age || !formData.experienceLevel || !formData.fitnessGoal || formData.availableEquipment.length === 0 || !formData.trainingDays) {
            setError('Per favore, completa tutti i campi.');
            setLoading(false);
            return;
        }

        const dataToSend = {
            ...formData,
            age: formData.age ? parseInt(formData.age, 10) : undefined,
            trainingDays: formData.trainingDays ? parseInt(formData.trainingDays, 10) : undefined,
        };

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError("Devi effettuare l'accesso per salvare il profilo e generare il programma");
                setLoading(false);
                return;
            }

            const response = await fetch(`${API_URL}/profile`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Errore sconosciuto');
            }

            setSuccessMessage('Profilo aggiornato con successo! Ora puoi generare il tuo programma.');

        } catch (err: any) {
            console.error("Error submitting profile:", err);
            setError(err.message || "Si è verificato un errore durante l'invio del profilo.");
        } finally {
            setLoading(false);
        }
    };

    return (
      <>
        <SEO
          title="Crea Programma Personalizzato"
          description="Crea un programma di calisthenics personalizzato in base alla tua età, esperienza e obiettivi. Ottieni un piano di allenamento su misura."
          keywords="creare programma calisthenics, piano personalizzato, allenamento su misura"
        />
        <div className="container mx-auto p-4 md:p-8 bg-black text-white min-h-screen">
            <motion.h1
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-linear-to-b from-white to-red-500"
            >
                Crea il Tuo Programma Personalizzato
            </motion.h1>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto bg-zinc-900/50 p-8 rounded-xl shadow-xl border border-zinc-800">
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {successMessage && <p className="text-green-500 text-center mb-4 flex items-center justify-center"><Check size={20} className="mr-2" /> {successMessage}</p>}

                {/* Age */}
                <div className="mb-6">
                    <label htmlFor="age" className="block text-lg font-semibold mb-2 text-zinc-300">Età</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleInputChange}
                        placeholder="Es. 25"
                        min="1"
                        max="120"
                        className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-800 focus:ring-red-500 focus:border-red-500"
                        required
                    />
                </div>

                {/* Experience Level */}
                <div className="mb-6">
                    <label htmlFor="experienceLevel" className="block text-lg font-semibold mb-2 text-zinc-300">Livello di Esperienza</label>
                    <select
                        id="experienceLevel"
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-800 focus:ring-red-500 focus:border-red-500 appearance-none"
                        required
                    >
                        <option value="" disabled>Seleziona il tuo livello</option>
                        <option value="principiante">Principiante</option>
                        <option value="intermedio">Intermedio</option>
                        <option value="avanzato">Avanzato</option>
                    </select>
                </div>

                {/* Fitness Goal */}
                <div className="mb-6">
                    <label htmlFor="fitnessGoal" className="block text-lg font-semibold mb-2 text-zinc-300">Obiettivo Principale</label>
                    <select
                        id="fitnessGoal"
                        name="fitnessGoal"
                        value={formData.fitnessGoal}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-800 focus:ring-red-500 focus:border-red-500 appearance-none"
                        required
                    >
                        <option value="" disabled>Seleziona il tuo obiettivo</option>
                        <option value="dimagrire">Dimagrire</option>
                        <option value="massa">Aumento Massa Muscolare</option>
                        <option value="forza">Aumento Forza</option>
                        <option value="mobilità">Migliorare Mobilità</option>
                    </select>
                </div>

                {/* Available Equipment */}
                <div className="mb-6">
                    <label className="block text-lg font-semibold mb-2 text-zinc-300">Attrezzatura Disponibile</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {['Pesi liberi', 'Panca', 'Trazioni alla sbarra', 'Elastici', 'Macchine isotoniche', 'Solo corpo libero'].map(equipment => (
                            <label key={equipment} className="flex items-center text-zinc-300">
                                <input
                                    type="checkbox"
                                    name="availableEquipment"
                                    value={equipment}
                                    checked={formData.availableEquipment.includes(equipment)}
                                    onChange={handleInputChange}
                                    className="form-checkbox h-5 w-5 text-red-500 bg-zinc-800 border-zinc-700 rounded focus:ring-red-500 mr-2"
                                />
                                {equipment}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Training Days */}
                <div className="mb-6">
                    <label htmlFor="trainingDays" className="block text-lg font-semibold mb-2 text-zinc-300">Giorni di Allenamento a Settimana</label>
                    <input
                        type="number"
                        id="trainingDays"
                        name="trainingDays"
                        value={formData.trainingDays}
                        onChange={handleInputChange}
                        placeholder="Es. 3"
                        min="1"
                        max="7"
                        className="w-full p-3 border border-zinc-700 rounded-lg bg-zinc-800 focus:ring-red-500 focus:border-red-500"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl font-black text-base uppercase tracking-widest text-white bg-red-600 shadow-xl shadow-red-900/20 hover:bg-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                    {loading ? (
                        <Loader2 className="w-5 h-5 mx-auto animate-spin" />
                    ) : (
                        'Salva Profilo e Inizia'
                    )}
                </button>
            </form>
        </div>
      </>
    );
}

export default Questionnaire;
