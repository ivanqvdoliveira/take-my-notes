<script>
  import {
    getAuth,
    signInWithEmailAndPassword,
  } from 'firebase/auth';
  import { app } from '../../firebase';

  let email;
  let password;
  let loginError = null

  const loginWithEmail = () => {
    console.log('email', email.value, 'password', password.value)
    if (!email || !password) {
      modalMsg = 'Favor preencher email e senha'
      return
    }
    const auth = getAuth(app)
    signInWithEmailAndPassword(
      auth,
      email.value,
      password.value,
    )
      .then(() => {
        window.location.href = '/'
      })
      .catch(() => {
        loginError = 'Erro. Login não efetuado - Nome ou Senha inválidos'
      })
  }
</script>

<div class="login container mx-auto">
  <form on:submit={loginWithEmail}>
    <label for="email">
      Email
      <input type="email" id="email" bind:this={email} required>
    </label>
    <label for="password">
      Senha
      <input type="password" id="password" bind:this={password} required>
    </label>
    {#if loginError}
      <p>{loginError}</p>
    {/if}
    <div class="flex justify-end">
      <button class="border rounded-md border-solid border-orange-600 text-orange-600 font-bold px-5 py-2 hover:bg-orange-700 hover:bg-opacity-95 hover:text-white" type="submit">Enviar</button>
    </div>
  </form>
</div>

<style lang="scss">
  label {
    @apply block mb-4 text-orange-600;
  }
  input {
    @apply w-full p-2 border border-gray-300 rounded bg-transparent;

    &:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 30px #311912 inset;
      -webkit-text-fill-color: white !important;
    }
  }
</style>
