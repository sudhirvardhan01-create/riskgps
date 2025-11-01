import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

interface Questionnaire {
  assetCategories: string[];
  questionCode: string;
  question: string;
  mitreControlId: string[];
  questionnaireId: string;
}

interface QuestionnaireProps {
  assetCategory: string | undefined; // coming from props
  questionnaires: Questionnaire[];
  onSubmit: (val: any) => void;
}

const QuestionnaireComponent: React.FC<QuestionnaireProps> = ({
  assetCategory,
  questionnaires,
  onSubmit,
}) => {
  const [filteredQuestions, setFilteredQuestions] = useState<Questionnaire[]>(
    []
  );
  const [responses, setResponses] = useState<any>({});

  useEffect(() => {
    const filterQuestions = questionnaires.filter(
      (q) => assetCategory && q.assetCategories.includes(assetCategory)
    );

    setFilteredQuestions(filterQuestions);
  }, [assetCategory, questionnaires]);

  const handleResponseChange = (
    questionCode: string,
    question: string,
    value: number
  ) => {
    setResponses((prev: any) => ({
      ...prev,
      [questionCode]: value,
    }));

    onSubmit({
      questionaireId: questionCode,
      questionaireName: question,
      responseValue: value,
    });
  };

  return (
    <Box sx={{ width: "70%", p: 3, mb: 5 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold">
        {assetCategory
          ? `${assetCategory} Security Questionnaire`
          : "Select an asset category"}
      </Typography>

      <Divider sx={{ mb: 3 }} />

      {filteredQuestions.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          No questions found for this asset category.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredQuestions.map((q) => (
            <Grid size={12} key={q.questionnaireId}>
              <Card
                sx={{
                  borderRadius: 3,
                  border: "1px solid #E7E7E8",
                }}
                elevation={0}
              >
                <CardContent>
                  <Grid
                    container
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={2}
                  >
                    <Grid size={{ xs: 12, md: 8 }}>
                      <Typography variant="subtitle1" fontWeight={500}>
                        {q.question}
                      </Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ mt: { xs: 1, md: 0 } }}
                      >
                        <InputLabel>Response</InputLabel>
                        <Select
                          value={responses[q.questionnaireId] ?? ""}
                          label="Response"
                          onChange={(e) =>
                            handleResponseChange(
                              q.questionnaireId,
                              q.question,
                              e.target.value
                            )
                          }
                        >
                          <MenuItem value={2}>Fully Implemented</MenuItem>
                          <MenuItem value={1}>Partially Implemented</MenuItem>
                          <MenuItem value={0}>Not Implemented</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* You can view current state below for debugging */}
      {/* <pre>{JSON.stringify(responses, null, 2)}</pre> */}
    </Box>
  );
};

export default QuestionnaireComponent;
