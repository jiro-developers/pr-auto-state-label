# pr-auto-state-label

## Usage

1. `.github/workflows/test-pr-auto-state-label.yml` 파일을 생성하고, 아래 [Example](#example)처럼 작성하세요.

## Inputs

| 값                         | 설명                                                                   | 필수여부 |
|---------------------------|----------------------------------------------------------------------|------|
| `token`                   | GitHub에서 제공하는 토큰.                                                    | O    |
| `label`                   | 각 review state의 조건에 따라 부착되는 라벨의 값 approve / comment / request change | O    |
| `deleteLabelPattern`      | 일률적으로 삭제를 시킬 라벨의 glob pattern                                        | X    |
| `skipReviewerNamePattern` | glob를 사용하여 해당 액션을 실행 시키지 않을 리뷰어 이름 패턴입니다.                            | X    |

### label

```
{
  "comment": "리뷰 완료", // 리뷰 완료 시 부착되는 라벨
  "requestChange": "병합 보류", // 리뷰 요청 변경 시 부착되는 라벨
  "approve": "Approve" // 리뷰 승인 시 부착되는 라벨
}
```

### deleteLabelPattern

- 라벨을 일률적으로 삭제를 시키기 위한 glob pattern입니다.
  - 만약 작성하지 않을 경우 `label` 의 값에 해당하는 라벨만 삭제됩니다.

## Example

```yml
name: pr-auto-state-label

on:
  pull_request_review:
    types: [ submitted ]


jobs:
  pr-auto-state-label:
    runs-on: [ ubuntu-latest ]
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: pr-auto-state-label
        uses: jiro-developers/pr-auto-state-label@latest
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          label: >
            { 
              "comment": "리뷰 완료",
              "requestChange": "병합 보류",
              "approve": "Approve"
            }
          deleteLabelPattern: "{D-*,hotfix}"
```

## Flow chart
![img.png](flowchart.png)

## License

```markdown
Copyright (c) 2025 /  [jiro Corp](https://www.jirocorp.io/ko)

Licensed under the Apache License, Version 2.0 (the "License");  
you may not use this file except in compliance with the License.  
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0  

Unless required by applicable law or agreed to in writing, software  
distributed under the License is distributed on an "AS IS" BASIS,  
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  
See the License for the specific language governing permissions and  
limitations under the License.

```
