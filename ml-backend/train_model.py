"""
Phase 2 - Train the Model

Pipeline:
    Load CSV -> Preprocess -> Split data -> Train Decision Tree
    -> Evaluate -> Save model

Predicts DIGITAL (0) vs PHYSICAL (1) ticket type and saves the result to
models/ticket_classifier.pkl for the Phase 3 API to load.
"""

import os
import joblib
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
)

DATA_PATH = os.path.join("data", "training_data.csv")
MODEL_DIR = "models"
MODEL_PATH = os.path.join(MODEL_DIR, "ticket_classifier.pkl")
TARGET = "label"
LABEL_MAP = {0: "DIGITAL", 1: "PHYSICAL"}


def load_data(path: str) -> pd.DataFrame:
    """Step 1: load the CSV."""
    df = pd.read_csv(path)
    if TARGET not in df.columns:
        raise ValueError(f"Expected a '{TARGET}' column in {path}")
    print(f" Loaded {len(df)} rows, {df.shape[1]} columns from {path}")
    return df


def preprocess(df: pd.DataFrame):
    """Step 2: clean the data and split it into features (X) and target (y)."""
    df = df.copy()

    # Make sure every column is numeric; anything unparseable becomes NaN
    df = df.apply(pd.to_numeric, errors="coerce")

    # Drop rows with missing values
    before = len(df)
    df = df.dropna()
    if len(df) < before:
        print(f" Dropped {before - len(df)} rows with missing/invalid values")

    # Keep only valid labels (0 = DIGITAL, 1 = PHYSICAL)
    df = df[df[TARGET].isin(LABEL_MAP.keys())]
    df[TARGET] = df[TARGET].astype(int)

    feature_cols = [c for c in df.columns if c != TARGET]
    X = df[feature_cols]
    y = df[TARGET]

    counts = y.value_counts().sort_index()
    print(f" Class balance: DIGITAL={counts.get(0, 0)}  PHYSICAL={counts.get(1, 0)}")
    return X, y, feature_cols


def split_data(X, y):
    """Step 3: 80/20 train/test split, stratified on the label."""
    return train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )


def train_model(X_train, y_train) -> DecisionTreeClassifier:
    """Step 4: train the Decision Tree."""
    model = DecisionTreeClassifier(
        max_depth=6,
        min_samples_leaf=5,
        class_weight="balanced",
        random_state=42,
    )
    model.fit(X_train, y_train)
    return model


def evaluate(model, X_test, y_test, feature_cols):
    """Step 5: evaluate on the held-out test set."""
    y_pred = model.predict(X_test)

    print(f"\n Test rows: {len(X_test)}")
    print(f" Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
    print("\n Classification report:")
    print(classification_report(y_test, y_pred, target_names=["DIGITAL", "PHYSICAL"]))
    print(" Confusion matrix (rows=actual, cols=predicted):")
    print(confusion_matrix(y_test, y_pred))

    print("\n Feature importances:")
    importances = sorted(
        zip(feature_cols, model.feature_importances_),
        key=lambda x: x[1],
        reverse=True,
    )
    for name, score in importances:
        print(f"   {name:<28} {score:.4f}")


def save_model(model, feature_cols, path: str):
    """Step 6: save the model with its feature order and label map."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    payload = {
        "model": model,
        "feature_columns": feature_cols,
        "label_map": LABEL_MAP,
    }
    joblib.dump(payload, path)
    print(f"\n Model saved to: {path}")


if __name__ == "__main__":
    print("=" * 55)
    print(" Train & Evaluate Ticket Classifier")
    print("=" * 55)

    df = load_data(DATA_PATH)
    X, y, feature_cols = preprocess(df)
    X_train, X_test, y_train, y_test = split_data(X, y)
    print(f" Train rows: {len(X_train)}")
    model = train_model(X_train, y_train)
    evaluate(model, X_test, y_test, feature_cols)
    save_model(model, feature_cols, MODEL_PATH)
