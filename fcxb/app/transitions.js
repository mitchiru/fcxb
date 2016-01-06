export default function(){
    this.transition(
        this.fromRoute('events'),
        this.toRoute('event.item'),
        this.use('toLeft'),
        this.reverse('toRight')
    );

    this.transition(
        this.fromRoute('events'),
        this.toRoute('tally'),
        this.use('toLeft'),
        this.reverse('toRight')
    );

    this.transition(
        this.fromRoute('events'),
        this.toRoute('league'),
        this.use('toLeft'),
        this.reverse('toRight')
    );

    this.transition(
        this.fromRoute('event.item'),
        this.toRoute('event.share'),
        this.use('toLeft'),
        this.reverse('toRight')
    );

    this.transition(
        this.fromRoute('event.item'),
        this.toRoute('event.lineup'),
        this.use('toLeft'),
        this.reverse('toRight')
    );

    this.transition(
        this.toRoute('event.new'),
        this.use('toLeft'),
        this.reverse('toRight')
    );
}