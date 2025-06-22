import type {
  MajorMentorPromptConfig,
  SchoolMatchPromptConfig,
  StoryStrategistPromptConfig,
  MajorOption,
  SchoolMatchOption,
  StoryOption,
} from "@/types/prompts";

import {
  majorMentorPrompt,
  schoolMatchPrompt,
  storyStrategistPrompt,
} from "@/lib/prompts";

describe("Prompt Configurations", () => {
  describe("majorMentorPrompt", () => {
    it("should be properly typed as MajorMentorPromptConfig", () => {
      const prompt: MajorMentorPromptConfig = majorMentorPrompt;

      expect(prompt).toBeDefined();
    });

    it("should have a non-empty text property", () => {
      expect(majorMentorPrompt.text).toBeDefined();
      expect(typeof majorMentorPrompt.text).toBe("string");
      expect(majorMentorPrompt.text.length).toBeGreaterThan(0);
    });

    it("should contain college admission advisor context in text", () => {
      expect(majorMentorPrompt.text).toContain("college admission advisor");
      expect(majorMentorPrompt.text).toContain("major in college");
    });

    it("should have a valid responseFormat array", () => {
      expect(Array.isArray(majorMentorPrompt.responseFormat)).toBe(true);
      expect(majorMentorPrompt.responseFormat.length).toBeGreaterThan(0);
    });

    it("should have responseFormat with correct structure", () => {
      const firstOption = majorMentorPrompt.responseFormat[0];

      expect(firstOption).toBeDefined();

      const optionKey = Object.keys(firstOption)[0];
      const option = firstOption[optionKey] as MajorOption;

      expect(option).toHaveProperty("majorTitle");
      expect(option).toHaveProperty("descriptionOfMajor");
      expect(option).toHaveProperty("whyThisMajor");
      expect(typeof option.majorTitle).toBe("string");
      expect(typeof option.descriptionOfMajor).toBe("string");
      expect(typeof option.whyThisMajor).toBe("string");
    });

    it("should have a complete getter that concatenates text and JSON", () => {
      const complete = majorMentorPrompt.complete;

      expect(typeof complete).toBe("string");
      expect(complete).toContain(majorMentorPrompt.text);
      expect(complete).toContain(
        JSON.stringify(majorMentorPrompt.responseFormat),
      );
    });

    it("should produce valid JSON when complete is parsed", () => {
      const complete = majorMentorPrompt.complete;
      const jsonPart = complete.replace(majorMentorPrompt.text, "");

      expect(() => JSON.parse(jsonPart)).not.toThrow();
    });
  });

  describe("schoolMatchPrompt", () => {
    it("should be properly typed as SchoolMatchPromptConfig", () => {
      const prompt: SchoolMatchPromptConfig = schoolMatchPrompt;

      expect(prompt).toBeDefined();
    });

    it("should have a non-empty text property", () => {
      expect(schoolMatchPrompt.text).toBeDefined();
      expect(typeof schoolMatchPrompt.text).toBe("string");
      expect(schoolMatchPrompt.text.length).toBeGreaterThan(0);
    });

    it("should contain college admission advisor context in text", () => {
      expect(schoolMatchPrompt.text).toContain("college admission advisor");
      expect(schoolMatchPrompt.text).toContain("chosing their college");
    });

    it("should have a valid responseFormat array", () => {
      expect(Array.isArray(schoolMatchPrompt.responseFormat)).toBe(true);
      expect(schoolMatchPrompt.responseFormat.length).toBeGreaterThan(0);
    });

    it("should have responseFormat with correct structure", () => {
      const firstOption = schoolMatchPrompt.responseFormat[0];

      expect(firstOption).toBeDefined();

      const optionKey = Object.keys(firstOption)[0];
      const option = firstOption[optionKey] as SchoolMatchOption;

      expect(option).toHaveProperty("collegeName");
      expect(option).toHaveProperty("descriptionOfCollege");
      expect(option).toHaveProperty("whyThisCollege");
      expect(typeof option.collegeName).toBe("string");
      expect(typeof option.descriptionOfCollege).toBe("string");
      expect(typeof option.whyThisCollege).toBe("string");
    });

    it("should have a complete getter that concatenates text and JSON", () => {
      const complete = schoolMatchPrompt.complete;

      expect(typeof complete).toBe("string");
      expect(complete).toContain(schoolMatchPrompt.text);
      expect(complete).toContain(
        JSON.stringify(schoolMatchPrompt.responseFormat),
      );
    });

    it("should produce valid JSON when complete is parsed", () => {
      const complete = schoolMatchPrompt.complete;
      const jsonPart = complete.replace(schoolMatchPrompt.text, "");

      expect(() => JSON.parse(jsonPart)).not.toThrow();
    });
  });

  describe("storyStrategistPrompt", () => {
    it("should be properly typed as StoryStrategistPromptConfig", () => {
      const prompt: StoryStrategistPromptConfig = storyStrategistPrompt;

      expect(prompt).toBeDefined();
    });

    it("should have a non-empty text property", () => {
      expect(storyStrategistPrompt.text).toBeDefined();
      expect(typeof storyStrategistPrompt.text).toBe("string");
      expect(storyStrategistPrompt.text.length).toBeGreaterThan(0);
    });

    it("should contain college admission advisor context in text", () => {
      expect(storyStrategistPrompt.text).toContain("college admission advisor");
      expect(storyStrategistPrompt.text).toContain("craft their story");
    });

    it("should have a valid responseFormat array", () => {
      expect(Array.isArray(storyStrategistPrompt.responseFormat)).toBe(true);
      expect(storyStrategistPrompt.responseFormat.length).toBeGreaterThan(0);
    });

    it("should have responseFormat with correct structure", () => {
      const firstOption = storyStrategistPrompt.responseFormat[0];

      expect(firstOption).toBeDefined();

      const optionKey = Object.keys(firstOption)[0];
      const option = firstOption[optionKey] as StoryOption;

      expect(option).toHaveProperty("title");
      expect(option).toHaveProperty("summary");
      expect(typeof option.title).toBe("string");
      expect(typeof option.summary).toBe("string");
    });

    it("should have a complete getter that concatenates text and JSON", () => {
      const complete = storyStrategistPrompt.complete;

      expect(typeof complete).toBe("string");
      expect(complete).toContain(storyStrategistPrompt.text);
      expect(complete).toContain(
        JSON.stringify(storyStrategistPrompt.responseFormat),
      );
    });

    it("should produce valid JSON when complete is parsed", () => {
      const complete = storyStrategistPrompt.complete;
      const jsonPart = complete.replace(storyStrategistPrompt.text, "");

      expect(() => JSON.parse(jsonPart)).not.toThrow();
    });
  });

  describe("Common prompt characteristics", () => {
    const prompts = [
      { name: "majorMentorPrompt", prompt: majorMentorPrompt },
      { name: "schoolMatchPrompt", prompt: schoolMatchPrompt },
      { name: "storyStrategistPrompt", prompt: storyStrategistPrompt },
    ];

    prompts.forEach(({ name, prompt }) => {
      describe(`${name}`, () => {
        it("should have text ending with JSON structure instruction", () => {
          expect(prompt.text).toMatch(/JSON format.*structure.*:?\s*$/i);
        });

        it("should have at least 2 response format examples", () => {
          expect(prompt.responseFormat.length).toBeGreaterThanOrEqual(2);
        });

        it("should have consistent option key naming", () => {
          prompt.responseFormat.forEach((item) => {
            const keys = Object.keys(item);

            expect(keys).toHaveLength(1);
            expect(keys[0]).toMatch(/^option\d+$/);
          });
        });

        it("should have all option values as objects with string properties", () => {
          prompt.responseFormat.forEach((item) => {
            const optionKey = Object.keys(item)[0];
            const option = item[optionKey];

            expect(typeof option).toBe("object");
            expect(option).not.toBeNull();

            Object.values(option).forEach((value) => {
              expect(typeof value).toBe("string");
              expect(value.length).toBeGreaterThan(0);
            });
          });
        });

        it("should have a complete property that is a string", () => {
          expect(typeof prompt.complete).toBe("string");
          expect(prompt.complete.length).toBeGreaterThan(prompt.text.length);
        });

        it("should have complete property that includes both text and JSON", () => {
          const { complete, text, responseFormat } = prompt;

          expect(complete).toContain(text);
          expect(complete).toContain(JSON.stringify(responseFormat));
        });
      });
    });
  });

  describe("Prompt content validation", () => {
    it("should have different text content for each prompt", () => {
      const texts = [
        majorMentorPrompt.text,
        schoolMatchPrompt.text,
        storyStrategistPrompt.text,
      ];

      // Check that all texts are unique
      const uniqueTexts = new Set(texts);

      expect(uniqueTexts.size).toBe(texts.length);
    });

    it("should have different response formats for each prompt", () => {
      const formats = [
        JSON.stringify(majorMentorPrompt.responseFormat),
        JSON.stringify(schoolMatchPrompt.responseFormat),
        JSON.stringify(storyStrategistPrompt.responseFormat),
      ];

      // Check that all formats are unique
      const uniqueFormats = new Set(formats);

      expect(uniqueFormats.size).toBe(formats.length);
    });

    it("should have meaningful example data in response formats", () => {
      // Major Mentor should have major-related content
      const majorExample = majorMentorPrompt.responseFormat[0];
      const majorOption = majorExample[Object.keys(majorExample)[0]];

      expect(majorOption.majorTitle).toMatch(/\w+/);
      expect(majorOption.descriptionOfMajor).toMatch(/\w+/);
      expect(majorOption.whyThisMajor).toMatch(/\w+/);

      // School Match should have college-related content
      const schoolExample = schoolMatchPrompt.responseFormat[0];
      const schoolOption = schoolExample[Object.keys(schoolExample)[0]];

      expect(schoolOption.collegeName).toMatch(/\w+/);
      expect(schoolOption.descriptionOfCollege).toMatch(/\w+/);
      expect(schoolOption.whyThisCollege).toMatch(/\w+/);

      // Story Strategist should have story-related content
      const storyExample = storyStrategistPrompt.responseFormat[0];
      const storyOption = storyExample[Object.keys(storyExample)[0]];

      expect(storyOption.title).toMatch(/\w+/);
      expect(storyOption.summary).toMatch(/\w+/);
    });
  });

  describe("Integration with existing codebase", () => {
    it("should be compatible with existing PromptReq component usage", () => {
      // Test that complete property can be used as systemPrompt
      expect(typeof majorMentorPrompt.complete).toBe("string");
      expect(typeof schoolMatchPrompt.complete).toBe("string");
      expect(typeof storyStrategistPrompt.complete).toBe("string");
    });

    it("should produce parseable JSON responses", () => {
      const prompts = [
        majorMentorPrompt,
        schoolMatchPrompt,
        storyStrategistPrompt,
      ];

      prompts.forEach((prompt) => {
        const jsonPart = prompt.complete.replace(prompt.text, "");
        const parsed = JSON.parse(jsonPart);

        expect(Array.isArray(parsed)).toBe(true);
        expect(parsed.length).toBeGreaterThan(0);
      });
    });
  });
});
