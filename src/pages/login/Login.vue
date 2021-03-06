<template>
	<common-layout>
		<div class="top">
			<div class="header">
				<img alt="logo" class="logo" src="@/assets/img/logo.png"/>
				<span class="title">{{systemName}}</span>
			</div>
			<div class="desc">Ant Design Web</div>
		</div>
		<div class="login">
			<a-form @submit="onSubmit" :form="form">
				<a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
					<a-tab-pane tab="Account" key="1">
						<a-alert type="error" :closable="true" v-show="error" :message="error" showIcon
										 style="margin-bottom: 24px;"/>
						<a-form-item>
							<a-input
								autocomplete="off"
								size="large"
								placeholder="Username"
								v-decorator="['username', {rules: [{ required: true, message: 'Please enter your username', whitespace: true}]}]"
							>
								<a-icon slot="prefix" type="user"/>
							</a-input>
						</a-form-item>
						<a-form-item>
							<a-input
								size="large"
								placeholder="Password"
								autocomplete="off"
								type="password"
								v-decorator="['password', {rules: [{ required: true, message: 'Please enter password', whitespace: true}]}]"
							>
								<a-icon slot="prefix" type="lock"/>
							</a-input>
						</a-form-item>
					</a-tab-pane>
				</a-tabs>
				<div>
					<a-checkbox :checked="true">Auto login</a-checkbox>
					<a style="float: right">Forget password</a>
				</div>
				<a-form-item>
					<a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit"
										type="primary">Log in
					</a-button>
				</a-form-item>
			</a-form>
		</div>
	</common-layout>
</template>

<script>
  import Mock from "mockjs";

  / * eslint-disable * /
  import CommonLayout from '@/layouts/CommonLayout'
  import {getRoutesConfig} from '@/services/user'
  import {setAuthorization} from '@/utils/request'
  import {loadRoutes} from '@/utils/routerUtil'
  import {mapMutations} from 'vuex'

  export default {
    name: 'Login',
    inject: ['UserRepository'],
    components: {CommonLayout},
    data() {
      return {
        logging: false,
        error: '',
        form: this.$form.createForm(this)
      }
    },
    computed: {
      systemName() {
        return this.$store.state.setting.systemName
      }
    },
    methods: {
      ...mapMutations('user', ['setUser', 'setPermissions', 'setRoles']),
      onSubmit(e) {
        e.preventDefault();
        console.log(this.form);
        this.form.validateFields((err) => {
          if (!err) {
            this.logging = true;
            const username = this.form.getFieldValue('username');
            const password = this.form.getFieldValue('password');
            let payload = {
              username,
              password
            };
            this.UserRepository.login(payload).then(this.afterLogin);
          }
        })
      },
      afterLogin(res) {
        this.logging = false;
        const loginRes = res.data;
        if (loginRes.status === 200) {
          console.log(loginRes);
          let user = loginRes.user;
          let permissions = [{id: 'queryForm', operation: ['add', 'edit']}];
          let roles = [{id: 'admin', operation: ['add', 'edit', 'delete']}];
          this.setUser(user);
          this.setPermissions(permissions);
          this.setRoles(roles);
          setAuthorization({token: loginRes.token});
          // Get routing configuration
          getRoutesConfig().then(result => {
            const routesConfig = result.data.data;
            console.log("routesConfig: ", routesConfig);
            loadRoutes(routesConfig);
            this.$router.push('/material/list');
            this.$message.success(Mock.mock('@TIMEFIX').US + '，welcome back', 3);
          })
        } else {
          this.error = loginRes.message
        }
      }
    }
  }
</script>

<style lang="less" scoped>
	.common-layout {
		.top {
			text-align: center;

			.header {
				height: 44px;
				line-height: 44px;

				a {
					text-decoration: none;
				}

				.logo {
					height: 44px;
					vertical-align: top;
					margin-right: 16px;
				}

				.title {
					font-size: 33px;
					color: @title-color;
					font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
					font-weight: 600;
					position: relative;
					top: 2px;
				}
			}

			.desc {
				font-size: 14px;
				color: @text-color-second;
				margin-top: 12px;
				margin-bottom: 40px;
			}
		}

		.login {
			width: 368px;
			margin: 0 auto;
			@media screen and (max-width: 576px) {
				width: 95%;
			}
			@media screen and (max-width: 320px) {
				.captcha-button {
					font-size: 14px;
				}
			}

			.icon {
				font-size: 24px;
				color: @text-color-second;
				margin-left: 16px;
				vertical-align: middle;
				cursor: pointer;
				transition: color 0.3s;

				&:hover {
					color: @primary-color;
				}
			}
		}
	}
</style>
