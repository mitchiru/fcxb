import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('tglc-draggable-object', 'Integration | Component | tglc draggable object', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{tglc-draggable-object}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#tglc-draggable-object}}
      template block text
    {{/tglc-draggable-object}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
