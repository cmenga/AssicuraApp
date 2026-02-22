from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from models import InsurancePolicy

INITIAL_POLICIES = [
    {
        "name": "RCA Base",
        "description": "Responsabilità civile obbligatoria",
        "vehicle_type": "auto",
        "price": 350.0,
    },
    {
        "name": "RCA Base",
        "description": "Responsabilità civile obbligatoria",
        "vehicle_type": "moto",
        "price": 200.0,
    },
    {
        "name": "RCA Base",
        "description": "Responsabilità civile obbligatoria",
        "vehicle_type": "autocarro",
        "price": 450.0,
    },
    {
        "name": "RC Massimale Alto",
        "description": "RCA con massimale maggiorato rispetto al minimo",
        "vehicle_type": "auto",
        "price": 450.0,
    },
    {
        "name": "RC Massimale Alto",
        "description": "RCA con massimale maggiorato rispetto al minimo",
        "vehicle_type": "moto",
        "price": 280.0,
    },
    {
        "name": "RC Massimale Alto",
        "description": "RCA con massimale maggiorato rispetto al minimo",
        "vehicle_type": "autocarro",
        "price": 550.0,
    },
    {
        "name": "Furto e Incendio",
        "description": "Copertura contro furto e incendio del veicolo",
        "vehicle_type": "auto",
        "price": 400.0,
    },
    {
        "name": "Furto e Incendio",
        "description": "Copertura contro furto e incendio del veicolo",
        "vehicle_type": "moto",
        "price": 250.0,
    },
    {
        "name": "Furto e Incendio",
        "description": "Copertura contro furto e incendio del veicolo",
        "vehicle_type": "autocarro",
        "price": 550.0,
    },
    {
        "name": "Kasko Completa",
        "description": "Copertura completa per danni al proprio veicolo anche se colpa propria",
        "vehicle_type": "auto",
        "price": 750.0,
    },
    {
        "name": "Kasko Completa",
        "description": "Copertura completa per danni al proprio veicolo anche se colpa propria",
        "vehicle_type": "moto",
        "price": 430.0,
    },
    {
        "name": "Kasko Completa",
        "description": "Copertura completa per danni al proprio veicolo anche se colpa propria",
        "vehicle_type": "autocarro",
        "price": 900.0,
    },
    {
        "name": "Mini Kasko",
        "description": "Copertura collisione limitata con altri veicoli identificati",
        "vehicle_type": "auto",
        "price": 500.0,
    },
    {
        "name": "Mini Kasko",
        "description": "Copertura collisione limitata con altri veicoli identificati",
        "vehicle_type": "moto",
        "price": 300.0,
    },
    {
        "name": "Mini Kasko",
        "description": "Copertura collisione limitata con altri veicoli identificati",
        "vehicle_type": "autocarro",
        "price": 650.0,
    },
    {
        "name": "Eventi Naturali",
        "description": "Copertura danni causati da grandine, alluvioni, trombe d’aria",
        "vehicle_type": "auto",
        "price": 420.0,
    },
    {
        "name": "Eventi Naturali",
        "description": "Copertura danni causati da grandine, alluvioni, trombe d’aria",
        "vehicle_type": "moto",
        "price": 240.0,
    },
    {
        "name": "Eventi Naturali",
        "description": "Copertura danni causati da grandine, alluvioni, trombe d’aria",
        "vehicle_type": "autocarro",
        "price": 580.0,
    },
    {
        "name": "Atti Vandalici",
        "description": "Copertura contro danni volontari da terzi",
        "vehicle_type": "auto",
        "price": 310.0,
    },
    {
        "name": "Atti Vandalici",
        "description": "Copertura contro danni volontari da terzi",
        "vehicle_type": "moto",
        "price": 180.0,
    },
    {
        "name": "Atti Vandalici",
        "description": "Copertura contro danni volontari da terzi",
        "vehicle_type": "autocarro",
        "price": 420.0,
    },
    {
        "name": "Cristalli",
        "description": "Riparazione o sostituzione dei vetri rotti",
        "vehicle_type": "auto",
        "price": 180.0,
    },
    {
        "name": "Cristalli",
        "description": "Riparazione o sostituzione dei vetri rotti",
        "vehicle_type": "moto",
        "price": 0.0,
    },  # moto in genere non ha cristalli
    {
        "name": "Cristalli",
        "description": "Riparazione o sostituzione dei vetri rotti",
        "vehicle_type": "autocarro",
        "price": 220.0,
    },
    {
        "name": "Assistenza Stradale",
        "description": "Servizio di soccorso e traino h24",
        "vehicle_type": "auto",
        "price": 150.0,
    },
    {
        "name": "Assistenza Stradale",
        "description": "Servizio di soccorso e traino h24",
        "vehicle_type": "moto",
        "price": 120.0,
    },
    {
        "name": "Assistenza Stradale",
        "description": "Servizio di soccorso e traino h24",
        "vehicle_type": "autocarro",
        "price": 180.0,
    },
    {
        "name": "Tutela Legale",
        "description": "Assistenza legale e spese giudiziarie",
        "vehicle_type": "auto",
        "price": 110.0,
    },
    {
        "name": "Tutela Legale",
        "description": "Assistenza legale e spese giudiziarie",
        "vehicle_type": "moto",
        "price": 80.0,
    },
    {
        "name": "Tutela Legale",
        "description": "Assistenza legale e spese giudiziarie",
        "vehicle_type": "autocarro",
        "price": 140.0,
    },
    {
        "name": "Infortuni Conducente",
        "description": "Copertura spese mediche e indennità per il conducente",
        "vehicle_type": "auto",
        "price": 230.0,
    },
    {
        "name": "Infortuni Conducente",
        "description": "Copertura spese mediche e indennità per il conducente",
        "vehicle_type": "moto",
        "price": 210.0,
    },
    {
        "name": "Infortuni Conducente",
        "description": "Copertura spese mediche e indennità per il conducente",
        "vehicle_type": "autocarro",
        "price": 260.0,
    },
    {
        "name": "Bonus Protetto",
        "description": "Non perde la classe di merito dopo incidente con colpa",
        "vehicle_type": "auto",
        "price": 95.0,
    },
    {
        "name": "Bonus Protetto",
        "description": "Non perde la classe di merito dopo incidente con colpa",
        "vehicle_type": "moto",
        "price": 75.0,
    },
    {
        "name": "Bonus Protetto",
        "description": "Non perde la classe di merito dopo incidente con colpa",
        "vehicle_type": "autocarro",
        "price": 120.0,
    },
    {
        "name": "No Assicurati",
        "description": "Copertura contro danni causati da veicoli non assicurati",
        "vehicle_type": "auto",
        "price": 200.0,
    },
    {
        "name": "No Assicurati",
        "description": "Copertura contro danni causati da veicoli non assicurati",
        "vehicle_type": "moto",
        "price": 180.0,
    },
    {
        "name": "No Assicurati",
        "description": "Copertura contro danni causati da veicoli non assicurati",
        "vehicle_type": "autocarro",
        "price": 240.0,
    },
    {
        "name": "Auto Sostitutiva",
        "description": "Veicolo sostitutivo durante le riparazioni",
        "vehicle_type": "auto",
        "price": 270.0,
    },
    {
        "name": "Auto Sostitutiva",
        "description": "Veicolo sostitutivo durante le riparazioni",
        "vehicle_type": "moto",
        "price": 0.0,
    },  # non applicabile
    {
        "name": "Auto Sostitutiva",
        "description": "Veicolo sostitutivo durante le riparazioni",
        "vehicle_type": "autocarro",
        "price": 300.0,
    },
    {
        "name": "Rinuncia alla Rivalsa",
        "description": "Copertura contro richieste di rivalsa da parte dell'assicuratore",
        "vehicle_type": "auto",
        "price": 130.0,
    },
    {
        "name": "Rinuncia alla Rivalsa",
        "description": "Copertura contro richieste di rivalsa da parte dell'assicuratore",
        "vehicle_type": "moto",
        "price": 110.0,
    },
    {
        "name": "Rinuncia alla Rivalsa",
        "description": "Copertura contro richieste di rivalsa da parte dell'assicuratore",
        "vehicle_type": "autocarro",
        "price": 150.0,
    },
    {
        "name": "Ritiro Patente",
        "description": "Indennità in caso di ritiro o perdita punti",
        "vehicle_type": "auto",
        "price": 90.0,
    },
    {
        "name": "Ritiro Patente",
        "description": "Indennità in caso di ritiro o perdita punti",
        "vehicle_type": "moto",
        "price": 70.0,
    },
    {
        "name": "Ritiro Patente",
        "description": "Indennità in caso di ritiro o perdita punti",
        "vehicle_type": "autocarro",
        "price": 100.0,
    },
]


async def seed(session: AsyncSession):
    for insurance_police in INITIAL_POLICIES:
        stmt = select(InsurancePolicy).where(
            InsurancePolicy.name == insurance_police["name"],
            InsurancePolicy.vehicle_type == insurance_police["vehicle_type"],
        )
        result = await session.execute(stmt)
        is_exist = result.scalar_one_or_none()
        
        if is_exist:
            continue

        model = InsurancePolicy(**insurance_police)
        session.add(model)
        await session.flush()
