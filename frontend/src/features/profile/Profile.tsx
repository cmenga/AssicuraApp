import { useState } from 'react';
import {
    User, Mail, MapPin, Calendar, FileText, CreditCard,
    Edit, Camera, Shield, CheckCircle, AlertCircle
} from 'lucide-react';

import type { AddressModel, UserModel } from '@/shared/type';


const patenti = [
    {
        id: 1,
        numero: 'U1ABC1234567',
        categoria: 'B',
        dataRilascio: '2005-06-15',
        dataScadenza: '2030-06-15',
        enteRilascio: 'Motorizzazione Civile di Roma',
        stato: 'Valida'
    },
    {
        id: 2,
        numero: 'U1XYZ9876543',
        categoria: 'A',
        dataRilascio: '2010-03-20',
        dataScadenza: '2030-03-20',
        enteRilascio: 'Motorizzazione Civile di Roma',
        stato: 'Valida'
    }
];

const getDaysUntilExpiry = (scadenza) => {
    const today = new Date();
    const expiryDate = new Date(scadenza);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

type ProfilePageProps = {
    user: UserModel;
    addresses: AddressModel[];
};

export default function ProfilePage(props: ProfilePageProps) {
    const { user, addresses } = props;
    const [editMode, setEditMode] = useState(false);
    const [activeSection, setActiveSection] = useState('personali');

    const [userData, setUserData] = useState({
        nome: 'Mario',
        cognome: 'Rossi',
        codiceFiscale: 'RSSMRA85M01H501U',
        dataNascita: '1985-01-01',
        luogoNascita: 'Roma',
        sesso: 'M',
        email: 'mario.rossi@email.com',
        telefono: '+39 333 1234567',
        indirizzo: 'Via Roma, 123',
        numeroCivico: '123',
        cap: '00100',
        citta: 'Roma',
        provincia: 'RM'
    });



    return (
        <>
            {/* Header */}


            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Profile Header Card */}
                <div className="bg-linear-to-r from-blue-600 to-cyan-500 rounded-3xl p-8 mb-8 text-white">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl font-bold border-4 border-white">
                                {userData.nome[0]}{userData.cognome[0]}
                            </div>
                            {editMode && (
                                <button className="absolute bottom-0 right-0 bg-white text-blue-600 p-3 rounded-full shadow-lg hover:bg-gray-100 transition">
                                    <Camera className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-4xl font-bold mb-2">{user.first_name} {user.last_name}</h2>
                            <p className="text-lg opacity-90 mb-1">{user.email}</p>
                            <p className="opacity-90">{user.phone_number}</p>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-2xl shadow-md p-2 mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveSection('personali')}
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition ${activeSection === 'personali'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Dati Personali
                        </button>
                        <button
                            onClick={() => setActiveSection('patenti')}
                            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition ${activeSection === 'patenti'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            Patenti
                        </button>
                    </div>
                </div>

                {/* Dati Personali Section */}
                {activeSection === 'personali' && (
                    <div className="space-y-6">
                        {/* Dati Anagrafici */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <User className="w-6 h-6 text-blue-600" />
                                Dati Anagrafici
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={userData.nome}
                                            onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium py-3">{user.first_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cognome</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={userData.cognome}
                                            onChange={(e) => setUserData({ ...userData, cognome: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium py-3">{user.last_name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Codice Fiscale</label>
                                    <p className="text-gray-900 font-medium py-3 bg-gray-50 px-4 rounded-xl">{user.fiscal_id}</p>
                                    <p className="text-xs text-gray-500 mt-1">Non modificabile</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Data di Nascita</label>
                                    <p className="text-gray-900 font-medium py-3 bg-gray-50 px-4 rounded-xl">
                                        {user.date_of_birth}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Non modificabile</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Luogo di Nascita</label>
                                    <p className="text-gray-900 font-medium py-3 bg-gray-50 px-4 rounded-xl">{user.place_of_birth}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Sesso</label>
                                    <p className="text-gray-900 font-medium py-3 bg-gray-50 px-4 rounded-xl">
                                        {user.gender === 'male' ? 'Maschio' : 'Femmina'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Contatti */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Mail className="w-6 h-6 text-blue-600" />
                                Contatti
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                    {editMode ? (
                                        <input
                                            type="email"
                                            value={userData.email}
                                            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium py-3">{user.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Telefono</label>
                                    {editMode ? (
                                        <input
                                            type="tel"
                                            value={userData.telefono}
                                            onChange={(e) => setUserData({ ...userData, telefono: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium py-3">{user.phone_number}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Residenza */}
                        <div className="bg-white rounded-2xl shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <MapPin className="w-6 h-6 text-blue-600" />
                                Residenza
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Indirizzo</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={addresses[0].street}
                                            onChange={(e) => setUserData({ ...userData, indirizzo: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium py-3">{addresses[0].street}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">CAP</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={userData.cap}
                                            onChange={(e) => setUserData({ ...userData, cap: e.target.value })}
                                            maxLength={5}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium py-3">{addresses[0].cap}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Città</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={userData.citta}
                                            onChange={(e) => setUserData({ ...userData, citta: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium py-3">{addresses[0].city}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Provincia</label>
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={userData.provincia}
                                            onChange={(e) => setUserData({ ...userData, provincia: e.target.value.toUpperCase() })}
                                            maxLength={2}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none uppercase"
                                        />
                                    ) : (
                                        <p className="text-gray-900 font-medium py-3">{addresses[0].province}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Security Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">I tuoi dati sono al sicuro</h4>
                                    <p className="text-sm text-gray-600">
                                        Tutte le informazioni sono protette con crittografia di livello bancario e non verranno mai condivise con terze parti.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Patenti Section */}
                {activeSection === 'patenti' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-gray-600">Visualizza tutte le tue patenti registrate</p>
                        </div>

                        {patenti.map((patente) => {
                            const daysLeft = getDaysUntilExpiry(patente.dataScadenza);
                            const isExpiringSoon = daysLeft < 180;

                            return (
                                <div key={patente.id} className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-start gap-4">
                                            <div className={`p-4 rounded-xl ${patente.stato === 'Valida' ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                <CreditCard className={`w-8 h-8 ${patente.stato === 'Valida' ? 'text-green-600' : 'text-red-600'
                                                    }`} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-2xl font-bold text-gray-900">Patente Categoria {patente.categoria}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${patente.stato === 'Valida'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {patente.stato}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600">Numero: {patente.numero}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {isExpiringSoon && (
                                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                                            <div className="flex items-center gap-2 text-orange-800">
                                                <AlertCircle className="w-5 h-5" />
                                                <p className="text-sm font-medium">
                                                    La patente scade tra {daysLeft} giorni. Ricordati di rinnovarla!
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Data Rilascio</label>
                                            <p className="text-gray-900 font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(patente.dataRilascio).toLocaleDateString('it-IT')}
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Data Scadenza</label>
                                            <p className="text-gray-900 font-medium flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {new Date(patente.dataScadenza).toLocaleDateString('it-IT')}
                                            </p>
                                        </div>

                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-600 mb-1">Ente Rilascio</label>
                                            <p className="text-gray-900 font-medium flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-gray-400" />
                                                {patente.enteRilascio}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 pt-6 border-t border-gray-200">
                                        <div className="flex gap-3">
                                            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition font-medium">
                                                <FileText className="w-5 h-5" />
                                                Scarica Copia
                                            </button>
                                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-medium">
                                                <Edit className="w-5 h-5" />
                                                Modifica
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="bg-white rounded-2xl shadow-md p-8 text-center border-2 border-dashed border-gray-300 hover:border-blue-500 transition cursor-pointer">
                            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CreditCard className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Aggiungi Nuova Patente</h3>
                            <p className="text-gray-600 mb-4">Registra un'altra patente al tuo profilo</p>
                            <button className="bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
                                Aggiungi Patente
                            </button>
                        </div>

                        {/* Info Box */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <CheckCircle className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-1">Perché registrare la patente?</h4>
                                    <p className="text-sm text-gray-600">
                                        Avere la patente registrata ci permette di calcolare preventivi più accurati e di inviarti promemoria automatici prima della scadenza.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}