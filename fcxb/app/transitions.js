export default function(){
    this.transition(
        this.toRoute('event.item'),
        this.use('toLeft', { duration: 300 })
    );

    this.transition(
        this.toRoute('matches'),
        this.use('toRight', { duration: 300 })
    );
}
