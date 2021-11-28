<template>
  <div class="container bg-info rounded">
    <div v-if="dataReady">
      <div class="row m-2">
        <div class="col">
          <h4>Username: {{ userName }}</h4>
        </div>
      </div>
      <div class="row m-2">
        <div class="col">
          <h4>Email: {{ email }}</h4>
        </div>
      </div>
      <div class="row m-2">
        <div class="col">
          <h4>Account Type: {{ userType }}</h4>
        </div>
      </div>
      <div class="row m-2">
        <div class="col">
          <h4>Join Date: {{ joinDate }}</h4>
        </div>
      </div>
      <div class="row justify-content-end m-2">
        <div class="col-auto mb-2">
          <button
            type="button"
            class="btn btn-warning"
            @click="openChangePasswordModal"
          >
            Change Password
          </button>
        </div>
        <div class="col-auto mb-2">
          <button type="button" class="btn btn-danger">Purge Account</button>
        </div>
      </div>
    </div>
    <ChangePasswordModal
      name="change-password-modal"
      @passwordChanged="closeChangePasswordModal"
    />
  </div>
</template>

<script>
// Imports.
import ChangePasswordModal from "../components/Modals/ChangePasswordModal.vue";
export default {
  name: "user",
  layout: "default",
  components: {
    ChangePasswordModal,
  },
  data: function () {
    return {
      userName: null,
      joinDate: null,
      email: null,
      userType: null,
      dataReady: false,
    };
  },

  mounted: function () {
    this.userName = this.$store.state.user.currentUser.userName;
    this.joinDate = new Date(
      this.$store.state.user.currentUser.createdOn
    ).toUTCString();
    this.email = this.$store.state.user.currentUser.userEmail;
    this.userType = this.$store.state.user.currentUser.userType;
    this.dataReady = true;
  },
  computed: {},
  methods: {
    openChangePasswordModal: function () {
      this.$modal.show("change-password-modal");
    },
    closeChangePasswordModal: function () {
      this.$modal.hide("change-password-modal");
    },
  },
};
</script>
