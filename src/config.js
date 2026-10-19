/* HORUS · configuração de acesso
   OWNER é o único e-mail que pode fazer o primeiro acesso e virar administrador.
   Os demais desta lista são liberados automaticamente nesse primeiro acesso. */
export const OWNER = 'caduliam325@gmail.com';
export const INITIAL_MEMBERS = [
  { email: 'caduliam325@gmail.com', nome: 'Carlos Marques', ini: 'CM', role: 'admin', repasse: 35, meta: 0 },
  { email: 'kaueom690@gmail.com', nome: 'Kauê Moraes', ini: 'KM', role: 'admin', repasse: 35, meta: 0 }
];
