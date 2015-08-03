export default function(){
    this.transition(
        this.fromRoute('events'),
        this.toRoute('event.item'),
        this.use('toLeft'),
        this.reverse('toRight')
    );

    this.transition(
        this.toRoute('event.new'),
        this.use('toLeft'),
        this.reverse('toRight')
    );
}