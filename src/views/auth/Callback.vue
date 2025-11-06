<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div>
      <h3>Procesando inicio de sesión...</h3>
      <p>Por favor, espere.</p>
    </div>
  </div>
</template>

<script>
import { msalInstance } from '@/auth/msalConfig';
import useJwt from '@/auth/jwt/useJwt';
import { getHomeRouteForLoggedInUser } from '@/auth/utils';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
import environment from "@/environment";

export default {
  async created() {
    try {
      const response = await msalInstance.handleRedirectPromise();

      if (response && response.account) {
        msalInstance.setActiveAccount(response.account);

        const idToken = response.idToken;

        const { data } = await this.$http.post(
            environment.uri + '/auth/microsoft-login',
            { idToken: idToken }
        );

        const { accessToken, userData } = data;


        useJwt.setToken(accessToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        this.$ability.update(userData.ability);

        this.$router.replace(getHomeRouteForLoggedInUser(userData.role))
            .then(() => {
              this.$toast({
                component: ToastificationContent,
                position: 'top-right',
                props: {
                  title: `Bienvenido ${userData.fullName}`,
                  icon: 'CoffeeIcon',
                  variant: 'Info',
                  text: 'Has ingresado exitosamente.',
                },
              });
            });

      } else {
        this.$router.push('/login');
      }
    } catch (err) {
      console.error('Error en el callback:', err);
      this.$router.push({ name: 'auth-login', query: { error: 'auth_failed' } });
    }
  },
};
</script>