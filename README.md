# pr-auto-state-label

## Usage

1. 메시지 전달을 위해 **SLACK_WEBHOOK_URL** 이름의 secret을 설정하세요.
    - Repository Settings > Secrets > New repository secret

2. `.github/workflows/release-notification-action.yml` 파일을 생성하고, 아래 [Example](#example)처럼 작성하세요.

## Inputs

| 값                    | 설명                                                                   | 필수여부 |
|----------------------|----------------------------------------------------------------------|------|
| `token`              | GitHub에서 제공하는 토큰.                                                    | O    |
| `label`              | 각 review state의 조건에 따라 부착되는 라벨의 값 approve / comment / request change | O    |
| `deleteLabelPattern` | 일률적으로 삭제를 시킬 라벨의 glob pattern                                        | X    |

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
        uses: ./
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
![img.png](https://private-user-images.githubusercontent.com/67212771/449085259-e7a3b956-814e-45a9-beeb-25e41f077381.png?jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NDkwMTQ2MjQsIm5iZiI6MTc0OTAxNDMyNCwicGF0aCI6Ii82NzIxMjc3MS80NDkwODUyNTktZTdhM2I5NTYtODE0ZS00NWE5LWJlZWItMjVlNDFmMDc3MzgxLnBuZz9YLUFtei1BbGdvcml0aG09QVdTNC1ITUFDLVNIQTI1NiZYLUFtei1DcmVkZW50aWFsPUFLSUFWQ09EWUxTQTUzUFFLNFpBJTJGMjAyNTA2MDQlMkZ1cy1lYXN0LTElMkZzMyUyRmF3czRfcmVxdWVzdCZYLUFtei1EYXRlPTIwMjUwNjA0VDA1MTg0NFomWC1BbXotRXhwaXJlcz0zMDAmWC1BbXotU2lnbmF0dXJlPTAwNmE4MzFlYjRlNGYzM2M5NDI2OGM2YzMwNTJmMGU1YjhmYmQ0YzI0YjQ2OGRmYTkyNzNmNWQ1MzcwYWUwZmYmWC1BbXotU2lnbmVkSGVhZGVycz1ob3N0In0.AVKGJTKivMVcRN-vl4VnwgJMlQKFnzbZkBjMKLbjSBs)

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
