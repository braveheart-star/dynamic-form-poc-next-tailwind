import { useEffect, useState } from "react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";

import { documentSchema, ekycSchema, inquirySchema } from "./schema";
import FormikControl from "../../components/surveyPage/SurveyFormikControl";
import { documentInitValues, surveyFields } from "../../utils/data";
import {
  DocumentStepInterface,
  EkycStepInterface,
  InquiryStepInterface,
} from "./interface";

export const SurveyContainer = () => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    entityType: "",
    requestDescription: "",
    birth: "",
    governmentId: "",
    passport: "",
    email_is_valid: false,
  });

  type ObjectKey = keyof typeof documentInitValues;

  useEffect(() => {
    if (documentInitValues[formData.entityType as ObjectKey]) {
      setFormData((prev) => ({
        ...prev,
        ...documentInitValues[formData.entityType as ObjectKey],
      }));
    }
  }, [formData.entityType]);

  const makeRequest = async (formData: any) => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleNextStep = (newData: any, final = false) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    if (final) {
      makeRequest(newData);
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = (newData: any) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setCurrentStep((prev) => prev - 1);
  };


  return (
    <div className="max-w-2xl p-4 mx-auto ">
      <p className="text-xl text-center">
        {currentStep === 0
          ? "Step 1: Inquiry form"
          : currentStep === 1
          ? "Step 2: Company Verification"
          : currentStep === 2
          ? "Step 3: eKYC"
          : "You are all set !"}
      </p>
      {currentStep === 0 && (
        <InquiryStep next={handleNextStep} data={formData} />
      )}
      {currentStep === 1 && (
        <DocumentStep
          next={handleNextStep}
          prev={handlePrevStep}
          data={formData}
        />
      )}
      {currentStep === 2 && (
        <EkycStep next={handleNextStep} prev={handlePrevStep} data={formData} />
      )}

      {currentStep === 3 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 border border-gray-600 rounded"
          >
            Go To Home
          </button>
        </div>
      )}
    </div>
  );
};

const SurveyPart = ({
  fields,
  formik,
  onClickException,
  loading,
  disableBtn,
  validated,
  qualityScore,
}: any) =>
  fields?.map((field: any, id: number) => (
    <FormikControl
      {...field}
      formik={formik}
      key={id}
      onClickException={onClickException}
      loading={loading}
      disableBtn={disableBtn}
      validated={validated}
      qualityScore={qualityScore}
    />
  ));

const InquiryStep = (props: InquiryStepInterface) => {
  const handleSubmit = (values: any) => {
    props.next({ ...values });
  };

  return (
    <Formik
      validationSchema={inquirySchema}
      initialValues={props.data}
      onSubmit={handleSubmit}
    >
      {(formik) => (
        <Form>
          <div className="py-8 space-y-4">
            <SurveyPart fields={surveyFields.inquiry} formik={formik} />
            <div className="flex justify-center">
              <button
                type="submit"
                className={`px-4 py-2 border border-gray-600 rounded `}
              >
                Continue
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const DocumentStep = (props: DocumentStepInterface) => {
  const handleSubmit = (values: any) => {
    props.next(values);
  };
  type ObjectKey = keyof typeof surveyFields.document;

  const schema = documentSchema[props.data.entityType as ObjectKey];

  return (
    <Formik
      validationSchema={schema}
      initialValues={props.data}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <div className="py-8 space-y-4">
            <SurveyPart
              fields={
                surveyFields.document[formik.values.entityType as ObjectKey]
              }
              formik={formik}
            />

            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 border border-gray-600 rounded"
                type="button"
                onClick={() => props.prev(formik.values)}
              >
                Back
              </button>

              <button
                type="submit"
                className="px-4 py-2 border border-gray-600 rounded"
              >
                Continue
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

const EkycStep = (props: EkycStepInterface) => {
  const handleSubmit = (values: any) => {
    props.next(values, true);
  };

  return (
    <Formik
      validationSchema={ekycSchema}
      initialValues={props.data}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {(formik) => (
        <Form>
          <div className="py-8 space-y-4">
            <SurveyPart fields={surveyFields.ekyc} formik={formik} />

            <div className="flex justify-center space-x-4">
              <button
                className="px-4 py-2 border border-gray-600 rounded"
                type="button"
                onClick={() => props.prev(formik.values)}
              >
                Back
              </button>

              <button
                type="submit"
                className="px-4 py-2 border border-gray-600 rounded"
              >
                Finish
              </button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
