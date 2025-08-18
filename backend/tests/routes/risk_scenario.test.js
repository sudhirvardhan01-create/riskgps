const request = require('supertest');
const app = require('../../server');

describe('RiskScenario API', () => {
  let createdId;

  it('should create a new risk scenario', async () => {
    const res = await request(app)
      .post('/library/risk-scenario')
      .send({
        risk_scenario: 'Test scenario',
        risk_description: 'Test description',
        risk_statement: 'Test statement',
        status: 'published',
        risk_field_1: 'Field 1',
        risk_field_2: 'Field 2',
        related_processes: [],
        attributes: []
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty('id');
    createdId = res.body.data.id;
  });

  it('should fetch all risk scenarios', async () => {
    const res = await request(app)
      .get('/library/risk-scenario');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data.data)).toBe(true);
  });

  it('should fetch a risk scenario by id', async () => {
    const res = await request(app)
      .get(`/library/risk-scenario/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('id', createdId);
  });

  it('should update a risk scenario', async () => {
    const res = await request(app)
      .put(`/library/risk-scenario/${createdId}`)
      .send({
        risk_scenario: 'Updated scenario',
        risk_description: 'Updated description',
        risk_statement: 'Updated statement',
        status: 'draft',
        risk_field_1: 'Updated Field 1',
        risk_field_2: 'Updated Field 2',
        related_processes: [],
        attributes: []
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.risk_scenario).toBe('Updated scenario');
  });

  it('should delete a risk scenario', async () => {
    const res = await request(app)
      .delete(`/library/risk-scenario/${createdId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty('message');
  });
});