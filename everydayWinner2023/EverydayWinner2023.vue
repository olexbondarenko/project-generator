<template>
    <div class="everyday-winner-2023">
        <main class="everyday-winner-2023__main"></main>
    </div>
</template>

<script>
    import {
        defineComponent, onMounted, onBeforeUnmount, inject,
    } from '@nuxtjs/composition-api';

    import AOS from 'aos';
    import 'aos/dist/aos.css';

    import {usePromoId} from 'composables/usePromoId';
    import {modalsList} from 'components/promotions/everydayWinner2023/constants/modalsList';

    export default defineComponent({
        name: 'EverydayWinner2023',
        components: {},
        setup() {
            const globalStore = inject('globalStore');
            const globalGetters = globalStore.getters;
            const isUserAuthorized = globalGetters.isUserAuth;
            const MY_PROMO_ID = 'everydayWinner2023';
            const {setPromoId} = usePromoId();

            setPromoId(MY_PROMO_ID);

            onMounted(() => {
                globalStore.mutations.setModalsList(modalsList);
                globalStore.mutations.setHasBanner(true);

                AOS.init({
                    once: true,
                    disable: 'mobile',
                });
            });

            onBeforeUnmount(() => {
                globalStore.mutations.setModalsList([]);
                globalStore.mutations.setHasBanner(false);
            });

            return {
                isUserAuthorized,
            };
        },
    });
</script>

<style scoped lang="scss">
@import 'components/promotions/everydayWinner2023/styles/component';
</style>