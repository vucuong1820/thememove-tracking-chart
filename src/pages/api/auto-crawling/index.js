import agendaJob from '@helpers/agendaJob';

export default async function handler(req, res) {
  await agendaJob();
  res.json();
}
