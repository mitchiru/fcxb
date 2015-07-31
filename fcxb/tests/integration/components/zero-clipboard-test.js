import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';


moduleForComponent('zero-clipboard', 'Integration | Component | zero clipboard', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{zero-clipboard}}`);

  assert.equal(this.$().text(), '');

  // Template block usage:
  this.render(hbs`
    {{#zero-clipboard}}
      template block text
    {{/zero-clipboard}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
