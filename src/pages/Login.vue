<template>
  <div class="main-wrapper">
		<div class="page-wrapper full-page">
			<div class="page-content d-flex align-items-center justify-content-center">
				<div class="row w-100 mx-0 auth-page">
					<div class="col-md-8 col-xl-6 mx-auto">
						<div class="card">
							<div class="row">
                <div class="col-md-4 pr-md-0">
                  <div class="auth-left-wrapper">
                  </div>
                </div>
                <div class="col-md-8 pl-md-0">
                  <div class="auth-form-wrapper px-4 py-5">
                    <router-link to="/" class="noble-ui-logo d-block mb-2">Emdiem<span>HM</span></router-link>
                    <h5 class="text-muted font-weight-normal mb-4">¡Bienvenido de vuelta! Inicia sesión en tu cuenta.</h5>
                    <form @submit.prevent="signIn" class="forms-sample">
                      <div class="form-group">
                        <label for="email">Correo electrónico</label>
                        <input type="email" class="form-control" id="email" placeholder="link@emdiem.com" v-model="email">
                      </div>
                      <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" class="form-control" id="password" autocomplete="current-password" placeholder="******" v-model="password">
                      </div>
                      <div class="mt-3">
                        <button type="submit" class="btn btn-primary mr-2 mb-2 mb-md-0">Iniciar sesión</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
  import { AUTH } from "@/firebase"
  export default {
    data() {
      return {
        email: "",
        password: ""
      }
    },
    methods: {
      async signIn() {
        if (this.email.trim() != "" && this.password.trim()) {
          try {
            await AUTH.signInWithEmailAndPassword(this.email, this.password)
          } catch (ex) {
            return console.error(ex)
          }
        } else {
          console.error("Asegúrese de rellenar todos los campos.")
        }
      }
    }
  }
</script>