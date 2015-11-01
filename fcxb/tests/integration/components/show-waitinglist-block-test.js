import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('show-waitinglist-block', 'Integration | Component | show waitinglist block', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{show-waitinglist-block}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#show-waitinglist-block}}
      template block text
    {{/show-waitinglist-block}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
