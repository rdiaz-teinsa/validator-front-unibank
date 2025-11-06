<template>
  <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div>
      <h3>Processing sign-in...</h3>
      <p>Please wait.</p>
    </div>
  </div>
</template>

<script>
import { msalInstance } from '@/auth/msalConfig';
import useJwt from '@/auth/jwt/useJwt';
import { getHomeRouteForLoggedInUser } from '@/auth/utils';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';
// environment.js is no longer needed here for the test
// import environment from "@/environment";

export default {
  async created() {
    try {
      const response = await msalInstance.handleRedirectPromise();

      if (response && response.account) {
        msalInstance.setActiveAccount(response.account);

        // --- TEST CODE: SKIP BACKEND CALL ---
        console.log("MSAL Response (User Data):", response.account);

        // 1. We are skipping the backend call:
        // const idToken = response.idToken;
        // const { data } = await this.$http.post(
        //     environment.uri + '/auth/microsoft-login',
        //     { idToken: idToken }
        // );
        // const { accessToken, userData } = data;

        // 2. Instead, create MOCK user data from the MSAL response
        const mockUserData = {
          fullName: response.account.name,
          username: response.account.username,
          role: 'user', // Assign a default role for testing
          ability: [ // Assign default abilities for testing
            { action: 'read', subject: 'all' }
          ],
        };

        // 3. We don't have an accessToken, so we skip useJwt.setToken()
        // useJwt.setToken(accessToken);

        // 4. Save the mock user data to localStorage to simulate login
        localStorage.setItem('userData', JSON.stringify(mockUserData));
        this.$ability.update(mockUserData.ability);

        // 5. Redirect to home
        this.$router.replace(getHomeRouteForLoggedInUser(mockUserData.role))
            .then(() => {
              this.$toast({
                component: ToastificationContent,
                position: 'top-right',
                props: {
                  title: `Welcome ${mockUserData.fullName}`,
                  icon: 'CoffeeIcon',
                  variant: 'Info',
                  text: 'Login test successful (no backend).',
                },
              });
            });
        // --- END OF TEST CODE ---

      } else {
        // This runs if the page is loaded without a login attempt
        this.$router.push('/login');
      }
    } catch (err) {
      console.error('Error in callback:', err);
      this.$router.push({ name: 'atoms-auth-login', query: { error: 'auth_failed' } });
    }
  },
};
</script>