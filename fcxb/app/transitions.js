export default function(){
    this.transition(
        this.toRoute('event'),
        this.use('toLeft', { duration: 300 })
    );

    this.transition(
        this.toRoute('events'),
        this.use('toRight', { duration: 300 })
    );
}
