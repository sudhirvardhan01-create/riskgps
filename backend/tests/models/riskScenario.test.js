const { Sequelize } = require('sequelize');
const defineRiskScenario = require('../../modules/library/models/riskScenario');

describe('RiskScenario Model', () => {
  let sequelize;
  let RiskScenario;

  beforeAll(async () => {
    sequelize = new Sequelize('sqlite::memory:', { logging: false });
    RiskScenario = defineRiskScenario(sequelize);
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it('should generate a risk_code after creation', async () => {
    const scenario = await RiskScenario.create({
      risk_scenario: 'Test scenario',
      risk_description: 'Test description',
      risk_statement: 'Test statement',
      status: 'published',
    });
    expect(scenario.risk_code).toMatch(/^#RS-\d{5}$/);
  });

  it('should have default status as published', async () => {
    const scenario = await RiskScenario.create({
      risk_scenario: 'Another scenario',
      risk_description: 'Another description',
      risk_statement: 'Another statement',
    });
    expect(scenario.status).toBe('published');
  });
});