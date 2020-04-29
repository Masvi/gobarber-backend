import { Router } from 'express';
import { uuid } from 'uuidv4';
import { startOfHour, parseISO, isEqual } from 'date-fns';

interface Appointment {
  id: string;
  provider: string;
  date: Date;
}

const appointmentsRouter = Router();
const appointments: Appointment[] = [];

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  // converte a data e zera os min e seg transformando em hora "cheia"
  const parseDate = startOfHour(parseISO(date));

  // verifica agendamentos no mesmo horario
  const findAppointmentsInSameDate = appointments.find(appointment =>
    isEqual(parseDate, appointment.date),
  );

  if (findAppointmentsInSameDate) {
    return response
      .status(400)
      .json({ message: 'This appointment is already booked' });
  }

  const appointment = {
    id: uuid(),
    provider,
    date: parseDate,
  };

  appointments.push(appointment);

  return response.json(appointment);
});

export default appointmentsRouter;
