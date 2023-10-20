<script setup lang="ts">
const { signIn, getSession } = useAuth()

const username = ref("")
const password = ref("")

const handleFormLogin = () => {
    signIn("credentials", {username: username.value, password: password.value})
}

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: "/"
  }
})

</script>

<template>
  <div class="max-w-xl px-6 py-4 mx-auto mt-4 bg-white rounded-lg shadow">
    <form @submit.prevent="handleFormLogin">
      <h1 class="text-xl font-bold text-center">Iniciar sesión</h1>
      <div class="space-y-4">
        <div class="flex flex-col justify-center space-y-1">
          <label class="custom-label" for="username">Nombre de usuario</label>
          <input
            v-model="username"
            id="username"
            type="text"
            class="custom-input"
            placeholder="Ingresa el nombre"
            autocomplete="off"
          />
        </div>
        <div class="flex flex-col justify-center space-y-1">
          <label class="custom-label" for="password">Contraseña</label>
          <input
            v-model="password"
            id="password"
            type="password"
            class="custom-input"
            placeholder="Ingresa la contraseña"
          />
        </div>
        <button class="w-full py-2 font-semibold transition rounded-lg bg-main-secondary text-neutral-800 hover:brightness-90">
            Iniciar sesión
        </button>
      </div>
    </form>
  </div>
</template>
