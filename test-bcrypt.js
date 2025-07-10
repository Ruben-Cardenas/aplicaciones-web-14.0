import bcrypt from 'bcryptjs';

async function testPassword() {
  const passwordPlano = "123456"; // Cambia aquí por la contraseña real
  const passwordHash = "$2b$10$h.CCwxsY5X62CBzTrAVowuwEVkeHqDprAqXl6d4ihR398ZUq0eUQm"; // Tu hash de la BD

  try {
    const isMatch = await bcrypt.compare(passwordPlano, passwordHash);
    console.log('¿Coincide la contraseña?', isMatch); // true o false
  } catch (error) {
    console.error('Error:', error);
  }
}

testPassword();
