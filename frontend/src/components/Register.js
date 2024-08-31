import React, { useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const REGISTER = gql`
  mutation CreateUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      id
      email
    }
  }
`;

function Register({ setIsLoggedIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [register, { error }] = useMutation(REGISTER);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ variables: { email, password } });
      setIsLoggedIn(true);
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        type="email"
        required
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        type="password"
        required
      />
      <button type="submit">Register</button>
      {error && <p>Error: {error.message}</p>}
    </form>
  );
}

export default Register;