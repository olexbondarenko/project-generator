<template>
    <EverydayWinner2023Modal
        @close="$emit('close')"
        class="everyday-winner-2023-modal-login"
    >
    </EverydayWinner2023Modal>
</template>

<script>
    import {defineComponent} from '@nuxtjs/composition-api';
    import EverydayWinner2023Modal from 'components/promotions/everydayWinner2023/components/EverydayWinner2023Modal';

    export default defineComponent({
        name: 'EverydayWinner2023ModalLogin',
        components: {
            EverydayWinner2023Modal,
        },
        setup(props, {emit}) {
            return {};
        },
    });
</script>

<style scoped lang="scss">
@import 'components/promotions/everydayWinner2023/components/modals/styles/everydayWinner2023ModalLogin/component';
</style>
