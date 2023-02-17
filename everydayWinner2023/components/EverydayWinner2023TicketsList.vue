<template>
    <ul
        class="everyday-winner-2023-tickets-list"
        :class="listClasses"
    >
        <li
            v-for="(ticket, index) in tickets"
            :key="`everyday-winner-2023-tickets-list__item-${index}`"
            :class="ticketClasses(ticket)"
            class="everyday-winner-2023-tickets-list__item"
        >
            {{ ticket.number }}
        </li>
    </ul>
</template>

<script>
    import {
        defineComponent, computed, toRefs, unref,
    } from '@nuxtjs/composition-api';

    export default defineComponent({
        name: 'EverydayWinner2023TicketsList',
        props: {
            type: {
                type: String,
                default: undefined,
            },
            tickets: {
                type: Array,
                default: () => [],
            },
        },
        setup(props) {
            const {type} = toRefs(props);

            const listClasses = computed(() => ({
                [`everyday-winner-2023-tickets-list--${unref(type)}`]: Boolean(unref(type)),
            }));

            const ticketClasses = (ticket) => (ticket.isWin ? 'everyday-winner-2023-tickets-list__item--win' : '');

            return {
                listClasses,
                ticketClasses,
            };
        },
    });
</script>

<style scoped lang="scss">
@import 'components/promotions/everydayWinner2023/components/styles/everydayWinner2023TicketsList/component';
</style>
