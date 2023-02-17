<template>
    <div class="everyday-winner-2023-modal">
        <button
            @click="$emit('close')"
            type="button"
            class="everyday-winner-2023-modal__close"
            title="Закрыть модальное окно"
        ></button>
        <div class="everyday-winner-2023-modal__content">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import {defineComponent} from '@nuxtjs/composition-api';

    export default defineComponent({
        name: 'EverydayWinner2023Modal',
    });
</script>

<style scoped lang="scss">
@import 'components/promotions/everydayWinner2023/components/styles/everydayWinner2023Modal/component';
</style>
