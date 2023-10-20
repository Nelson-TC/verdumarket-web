<script setup>
definePageMeta({
  auth: false,
});

const { getSession } = useAuth();

const session = await getSession();

const authenticatedLinks = [{ label: "Productos", route: "/products" }];
</script>

<template>
  <h1 class="mt-4 text-2xl font-black text-center text-neutral-600">Inicio</h1>
  <div class="h-auto max-w-4xl mx-auto mt-4">
    <div v-if="session.user" class="grid grid-cols-1 mt-4 md:grid-cols-2">
      <NuxtLink
        v-for="link in authenticatedLinks"
        :key="link.route"
        :to="link.route"
        class="w-full p-4 font-bold bg-white rounded-lg shadow text-neutral-600"
      >
        {{ link.label }}
      </NuxtLink>
    </div>
    <div
      class="px-4 py-12 font-semibold text-center bg-white rounded-lg shadow text-neutral-600"
      v-else
    >
      <p class="mb-12">
        Inicia sesión para poder desbloquear todas las funcionalidades
      </p>
      <NuxtLink
        to="/login"
        class="w-full px-8 py-4 transition rounded-lg shadow bg-main-light hover:brightness-90"
      >
        Iniciar sesión
      </NuxtLink>
    </div>
  </div>
</template>