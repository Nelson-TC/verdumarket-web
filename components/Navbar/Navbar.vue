<script setup>
const { getSession, signOut } = useAuth();

const show = ref(false);

const session = await getSession();

const links = [
  { name: "Inicio", route: "/" },
];

if (session.user) {
  links.push(
    { name: "Productos", route: "/products" },
    { name: "Categorias", route: "/categories"}
  )
}else{ 
  links.push({ name: "Iniciar sesión", route: "/login" })
}

const router = useNuxtApp().$router;

router.afterEach(() => {
  show.value = false;
});

const currentRoute = computed(() => {
  return router.currentRoute.value.path;
});

const logout = () => {
  signOut();
};

watch(() => show.value, () => {
    if (show.value) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = null;
    }
});

</script>
<template>
  <div class="sticky top-0 z-40 p-1 md:p-2 bg-neutral-300">
    <div
      class="relative z-50 flex items-center justify-between p-0.5 bg-white rounded-lg shadow fill-main-dark pr-2"
    >
      <!-- Sección de botón de menu lateral -->
      <button
        class="p-2.5 transition-all duration-100 rounded-lg z-30 bg-white hover:bg-neutral-200"
        :class="{ 'translate-x-[14rem] shadow-md': show }"
        @click="show = !show"
      >
        <i v-show="!show">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8"
            viewBox="0 0 448 512"
          >
            <!--! Font Awesome Free 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M0 96C0 78.3 14.3 64 32 64H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32H416c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H416c17.7 0 32 14.3 32 32z"
            />
          </svg>
        </i>
        <i v-show="show">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-8 h-8"
            viewBox="0 0 448 512"
          >
            <!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
            <path
              d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
            />
          </svg>
        </i>
      </button>

      <!-- Sección de búsqueda -->
      <!-- <NavbarSearch /> -->

      <!-- Sección de perfil -->
      <div class="flex items-center justify-center space-x-2">
        <DropdownTitle align="right" width="48" v-if="session.user">
          <template #trigger>
            <span class="inline-flex rounded-md">
              <button
                type="button"
                ref="userDropdown"
                class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out bg-transparent border border-transparent rounded-md text-neutral-800 focus:outline-none focus:brightness-95 hover:bg-neutral-200 active:bg-neutral-200 focus:bg-neutral-200"
              >
                {{ session.user.name }}
                <svg
                  class="ml-2 -mr-0.5 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </span>
          </template>

          <template #title> Administrar cuenta </template>
          <template #content>
            <form @submit.prevent="logout">
              <DropdownLink as="button"> Cerrar sesión </DropdownLink>
            </form>
          </template>
        </DropdownTitle>

        <NuxtLink
          to="/login"
          class="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 transition duration-150 ease-in-out bg-transparent border border-transparent rounded-md text-neutral-800 focus:outline-none hover:bg-neutral-200"
          v-else
        >
          Iniciar sesión
        </NuxtLink>
      </div>

      <!-- Menú lateral -->
      <nav class="fixed top-0 left-0">
        <div class="relative top-0 left-0">
          <Transition
            enter-active-class="duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="duration-200 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              class="fixed inset-0 bg-black/50 z-[49]"
              v-show="show"
              @click="show = !show"
            />
          </Transition>

          <Transition
            enter-active-class="transition duration-150"
            enter-from-class="transform -translate-x-20 opacity-0"
            enter-to-class="transform translate-x-0 opacity-100"
            leave-active-class="transition duration-150"
            leave-from-class="transform translate-x-0 opacity-100"
            leave-to-class="transform -translate-x-20 opacity-0"
          >
            <ul
              class="absolute z-50 flex flex-col space-y-2 p-8 w-[16rem] h-screen overflow-y-auto bg-white shadow-lg rounded-r-md"
              v-show="show"
            >
              <li class="h-auto" v-for="link in links" :key="link.name">
                <NavbarLink
                  :href="link.route"
                  :active="link.route === currentRoute"
                >
                  {{ link.name }}
                </NavbarLink>
              </li>
            </ul>
          </Transition>
        </div>
      </nav>
    </div>
  </div>
</template>