import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('is-on-waitinglist', 'Integration | Component | is on waitinglist', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{is-on-waitinglist}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#is-on-waitinglist}}
      template block text
    {{/is-on-waitinglist}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
