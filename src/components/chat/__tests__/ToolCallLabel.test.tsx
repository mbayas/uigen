import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ToolCallLabel, getToolDisplay } from "../ToolCallLabel";

// --- getToolDisplay unit tests ---

test("getToolDisplay: str_replace_editor create with path returns Created label", () => {
  const { label } = getToolDisplay("str_replace_editor", {
    command: "create",
    path: "/components/Button.tsx",
  });
  expect(label).toBe("Created Button.tsx");
});

test("getToolDisplay: str_replace_editor create without path returns generic Created label", () => {
  const { label } = getToolDisplay("str_replace_editor", { command: "create" });
  expect(label).toBe("Created file");
});

test("getToolDisplay: str_replace_editor str_replace with path returns Edited label", () => {
  const { label } = getToolDisplay("str_replace_editor", {
    command: "str_replace",
    path: "/App.jsx",
  });
  expect(label).toBe("Edited App.jsx");
});

test("getToolDisplay: str_replace_editor str_replace without path returns generic Edited label", () => {
  const { label } = getToolDisplay("str_replace_editor", {
    command: "str_replace",
  });
  expect(label).toBe("Edited file");
});

test("getToolDisplay: str_replace_editor view returns Viewed label", () => {
  const { label } = getToolDisplay("str_replace_editor", {
    command: "view",
    path: "/utils/helpers.ts",
  });
  expect(label).toBe("Viewed helpers.ts");
});

test("getToolDisplay: str_replace_editor insert returns Inserted into label", () => {
  const { label } = getToolDisplay("str_replace_editor", {
    command: "insert",
    path: "/styles/index.css",
  });
  expect(label).toBe("Inserted into index.css");
});

test("getToolDisplay: str_replace_editor undo_edit returns Undid edit label", () => {
  const { label } = getToolDisplay("str_replace_editor", {
    command: "undo_edit",
    path: "/App.jsx",
  });
  expect(label).toBe("Undid edit to App.jsx");
});

test("getToolDisplay: str_replace_editor unknown command with path returns Modified label", () => {
  const { label } = getToolDisplay("str_replace_editor", {
    command: "unknown_command",
    path: "/App.jsx",
  });
  expect(label).toBe("Modified App.jsx");
});

test("getToolDisplay: str_replace_editor unknown command without path returns friendly fallback", () => {
  const { label } = getToolDisplay("str_replace_editor", {});
  expect(label).toBe("Modified file");
});

test("getToolDisplay: file_manager rename returns Renamed label", () => {
  const { label } = getToolDisplay("file_manager", {
    command: "rename",
    path: "/old.jsx",
    new_path: "/new.jsx",
  });
  expect(label).toBe("Renamed old.jsx → new.jsx");
});

test("getToolDisplay: file_manager rename without paths returns generic Renamed label", () => {
  const { label } = getToolDisplay("file_manager", { command: "rename" });
  expect(label).toBe("Renamed file");
});

test("getToolDisplay: file_manager delete returns Deleted label", () => {
  const { label } = getToolDisplay("file_manager", {
    command: "delete",
    path: "/temp.jsx",
  });
  expect(label).toBe("Deleted temp.jsx");
});

test("getToolDisplay: file_manager unknown command returns friendly fallback", () => {
  const { label } = getToolDisplay("file_manager", { command: "unknown" });
  expect(label).toBe("Managed file");
});

test("getToolDisplay: unknown tool name returns friendly fallback", () => {
  const { label } = getToolDisplay("some_internal_tool", {});
  expect(label).toBe("some_internal_tool");
});

// --- ToolCallLabel rendering tests ---

test("ToolCallLabel renders label text for create command", () => {
  render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "create", path: "/App.jsx" }}
    />
  );
  expect(screen.getByText("Created App.jsx")).toBeDefined();
});

test("ToolCallLabel renders label text for str_replace command", () => {
  render(
    <ToolCallLabel
      toolName="str_replace_editor"
      args={{ command: "str_replace", path: "/components/Card.tsx" }}
    />
  );
  expect(screen.getByText("Edited Card.tsx")).toBeDefined();
});

test("ToolCallLabel renders friendly fallback when no command is given", () => {
  render(<ToolCallLabel toolName="str_replace_editor" args={{}} />);
  expect(screen.getByText("Modified file")).toBeDefined();
});

test("ToolCallLabel renders friendly fallback for unknown file_manager command", () => {
  render(<ToolCallLabel toolName="file_manager" args={{}} />);
  expect(screen.getByText("Managed file")).toBeDefined();
});

test("ToolCallLabel renders delete label for file_manager delete", () => {
  render(
    <ToolCallLabel
      toolName="file_manager"
      args={{ command: "delete", path: "/old-component.jsx" }}
    />
  );
  expect(screen.getByText("Deleted old-component.jsx")).toBeDefined();
});

test("ToolCallLabel renders rename label with arrow for file_manager rename", () => {
  render(
    <ToolCallLabel
      toolName="file_manager"
      args={{ command: "rename", path: "/foo.jsx", new_path: "/bar.jsx" }}
    />
  );
  expect(screen.getByText("Renamed foo.jsx → bar.jsx")).toBeDefined();
});
